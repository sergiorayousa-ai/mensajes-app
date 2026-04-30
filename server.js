const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Simulated Database (en producción usar MongoDB)
const CLIENTS_DB = './clients.json';
const TEMPLATES_DB = './templates.json';

// Helper para leer/escribir JSON
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ============ API ROUTES ============

// 1. GUARDAR INFORMACIÓN DEL NEGOCIO
app.post('/api/business-info', (req, res) => {
  const { clientId, ...info } = req.body;
  const clients = readJSON(CLIENTS_DB);
  
  let client = clients.find(c => c.id === clientId);
  if (!client) {
    client = {
      id: Date.now().toString(),
      createdAt: new Date(),
      messageCount: 0,
      ...info
    };
    clients.push(client);
  } else {
    Object.assign(client, info);
  }
  
  writeJSON(CLIENTS_DB, clients);
  res.json({ success: true, clientId: client.id });
});

// 2. OBTENER INFORMACIÓN DEL NEGOCIO
app.get('/api/business-info/:clientId', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);
  res.json(client || {});
});

// 3. GUARDAR CONTACTOS
app.post('/api/contacts/:clientId', (req, res) => {
  const { contacts } = req.body;
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);
  
  if (client) {
    client.contacts = contacts;
    writeJSON(CLIENTS_DB, clients);
    res.json({ success: true, count: contacts.length });
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
});

// 4. OBTENER CONTACTOS
app.get('/api/contacts/:clientId', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);
  res.json(client?.contacts || []);
});

// 5. EXPORTAR CONTACTOS A EXCEL
app.get('/api/export-excel/:clientId', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);
  
  if (!client || !client.contacts) {
    return res.status(404).json({ error: 'No hay contactos' });
  }

  // Crear CSV (Excel puede leerlo)
  let csv = 'Nombre,Teléfono,Plataforma,Fecha Agregado\n';
  client.contacts.forEach(c => {
    csv += `"${c.name}","${c.phone}","${c.platform}","${c.addedAt || 'N/A'}"\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="contactos.csv"');
  res.send(csv);
});

// 6. GUARDAR PLANTILLAS PERSONALIZADAS
app.post('/api/templates/:clientId', (req, res) => {
  const { name, content, type } = req.body;
  const templates = readJSON(TEMPLATES_DB);
  
  const template = {
    id: Date.now().toString(),
    clientId: req.params.clientId,
    name,
    content,
    type,
    createdAt: new Date()
  };
  
  templates.push(template);
  writeJSON(TEMPLATES_DB, templates);
  res.json({ success: true, id: template.id });
});

// 7. OBTENER PLANTILLAS
app.get('/api/templates/:clientId', (req, res) => {
  const templates = readJSON(TEMPLATES_DB);
  const clientTemplates = templates.filter(t => t.clientId === req.params.clientId);
  res.json(clientTemplates);
});

// 8. ELIMINAR PLANTILLA
app.delete('/api/templates/:clientId/:templateId', (req, res) => {
  let templates = readJSON(TEMPLATES_DB);
  templates = templates.filter(t => t.id !== req.params.templateId);
  writeJSON(TEMPLATES_DB, templates);
  res.json({ success: true });
});

// 9. REGISTRAR ENVÍO DE MENSAJE (para contador de 100 gratis)
app.post('/api/send-message/:clientId', (req, res) => {
  const { contacts, message, platform, includeInfo } = req.body;
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);

  if (client) {
    client.messageCount = (client.messageCount || 0) + contacts.length;
    writeJSON(CLIENTS_DB, clients);

    // Generar enlaces de WhatsApp para envío manual
    const whatsappLinks = contacts
      .filter(c => c.platform.toLowerCase().includes('whatsapp') || platform === 'all')
      .map(c => ({
        name: c.name,
        phone: c.phone,
        link: `https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
      }));

    const remainingFree = Math.max(0, 100 - client.messageCount);
    const paidMessages = Math.max(0, client.messageCount - 100);

    res.json({
      success: true,
      whatsappLinks,
      messagesSent: contacts.length,
      totalSent: client.messageCount,
      remainingFree,
      paidMessages,
      estimatedCost: paidMessages * 0.05 // $0.05 por mensaje pago
    });
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
});

// 10. OBTENER ESTADÍSTICAS
app.get('/api/stats/:clientId', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);

  if (!client) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  const remainingFree = Math.max(0, 100 - (client.messageCount || 0));
  const paidMessages = Math.max(0, (client.messageCount || 0) - 100);

  res.json({
    totalMessages: client.messageCount || 0,
    remainingFree,
    paidMessages,
    estimatedCost: paidMessages * 0.05,
    contacts: client.contacts?.length || 0,
    businessName: client.name || 'Sin nombre'
  });
});

// 11. MENÚ - Guardar
app.post('/api/menu/:clientId', (req, res) => {
  const { menu } = req.body;
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);

  if (client) {
    client.menu = menu;
    writeJSON(CLIENTS_DB, clients);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
});

// 12. MENÚ - Obtener
app.get('/api/menu/:clientId', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const client = clients.find(c => c.id === req.params.clientId);
  res.json(client?.menu || []);
});

// ============ ADMIN ROUTES (para que TÚ controles clientes) ============

// Dashboard admin
app.get('/api/admin/clients', (req, res) => {
  const clients = readJSON(CLIENTS_DB);
  const summary = clients.map(c => ({
    id: c.id,
    name: c.name || 'Sin nombre',
    contacts: c.contacts?.length || 0,
    messageCount: c.messageCount || 0,
    createdAt: c.createdAt,
    estimatedRevenue: Math.max(0, (c.messageCount || 0) - 100) * 0.05
  }));
  res.json(summary);
});

// ============ SERVE STATIC ============
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✓ App disponible en http://localhost:${PORT}`);
  console.log(`✓ Admin panel en http://localhost:${PORT}/admin`);
});
