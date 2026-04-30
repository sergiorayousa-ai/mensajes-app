# 📱 Gestor de Mensajes - Sky View Mark+

**Aplicación web profesional para enviar mensajes WhatsApp/SMS a clientes de restaurantes y negocios.**

## 🎯 Características

✅ **Gestión de contactos** - Importa, busca y organiza clientes  
✅ **Mensajería WhatsApp/SMS** - Envía desde el navegador (sin API costs iniciales)  
✅ **Plantillas personalizadas** - Guarda y reutiliza mensajes  
✅ **Información del negocio** - Dirección, horarios, teléfono  
✅ **Menú digital** - Administra productos y precios  
✅ **Estadísticas** - Controla uso (100 gratis, luego $0.05/msg)  
✅ **Excel export** - Descarga contactos en CSV  
✅ **Admin panel** - Controla tus clientes y cobra mensualmente  

## 💰 Modelo de Negocio

### Para tu cliente:
- **100 mensajes gratis** el primer mes
- Después: **$0.05 por mensaje** (via Twilio, opcional)
- Pueden usar WhatsApp gratis desde su teléfono

### Para ti (SkyView Mark+):
1. **Implementación inicial**: $200-500
2. **Integración WhatsApp**: $100-200
3. **Soporte mensual**: $50-100/mes
4. **Personalizaciones**: $50-100/hora

## 🚀 Deployment en Render (Gratis)

### Paso 1: Crear cuenta en Render
1. Ve a https://render.com
2. Crea cuenta gratis con GitHub o email
3. Confirma tu email

### Paso 2: Crear Web Service
1. En Render dashboard, haz clic en **New +**
2. Selecciona **Web Service**
3. Conecta tu repositorio de GitHub (o sube código ZIP)
4. Configura:
   - **Name**: `mensajes-app` (o nombre tu cliente)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### Paso 3: Variables de Entorno
En Render, ve a **Environment** y agrega:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secret_seguro_min_32_caracteres
```

### Paso 4: Deploy
Haz clic en **Deploy**. Espera 2-3 minutos.

Tu app estará en: `https://mensajes-app.onrender.com`

---

## 🔧 Instalación Local (para desarrollo)

```bash
# 1. Clona o descarga este repo
cd mensajes-app

# 2. Instala dependencias
npm install

# 3. Crea archivo .env
cp .env.example .env

# 4. Edita .env con tus datos
nano .env

# 5. Inicia servidor
npm start

# 6. Abre navegador
# http://localhost:3000
```

---

## 📋 Estructura de Archivos

```
mensajes-app/
├── server.js              # Backend Express
├── package.json           # Dependencias
├── .env.example           # Template variables de entorno
├── public/
│   ├── index.html         # App del cliente
│   └── admin.html         # Panel admin (tu control)
└── README.md              # Este archivo
```

---

## 🔐 Admin Panel (Para ti)

**URL**: `https://tu-app.onrender.com/admin`

### Funciones:
- Ver lista de clientes
- Ver uso de mensajes por cliente
- Estimar ingresos
- Agregar nuevos clientes
- Controlar acceso

---

## 💳 Integración Twilio (Opcional - Para SMS pagos)

Si quieres que cliente use SMS premium:

1. Ve a https://www.twilio.com
2. Crea cuenta (trial gratis $15)
3. Obtén:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - Número de teléfono Twilio
4. Agrega a `.env` en Render

---

## 📊 API Endpoints

```
POST   /api/business-info           # Guardar info negocio
GET    /api/business-info/:clientId # Obtener info
POST   /api/contacts/:clientId      # Guardar contactos
GET    /api/contacts/:clientId      # Obtener contactos
GET    /api/export-excel/:clientId  # Descargar CSV
POST   /api/send-message/:clientId  # Registrar envío
GET    /api/stats/:clientId         # Ver estadísticas
POST   /api/templates/:clientId     # Guardar plantilla
GET    /api/templates/:clientId     # Obtener plantillas
GET    /api/admin/clients           # Ver todos los clientes (ADMIN)
```

---

## 🎯 Plan de Venta a Clientes

### Presentación:
1. **"Necesitas una forma profesional de contactar tus clientes"**
2. Muestra demo: https://tu-app.onrender.com
3. Explica ventajas:
   - ✅ Mensajes ilimitados (100 gratis)
   - ✅ Sin costo de SMS/WhatsApp si usan su teléfono
   - ✅ Plantillas guardadas
   - ✅ Estadísticas
   - ✅ Soporte incluido

### Propuesta:
```
📋 PAQUETE: Gestor de Mensajes
├─ Implementación inicial: $300
├─ Integración + capacitación: $150
├─ Soporte mensual: $79/mes (o $0/mes si usan solo WhatsApp gratis)
└─ SMS opcional: $0.05 por mensaje (después de 100 gratis)
```

---

## 🆘 Troubleshooting

### App no carga
- Verifica que Render tenga PORT=3000
- Revisa logs en Render dashboard

### Contactos no se guardan
- Verifica que el servidor esté corriendo
- Revisa consola del navegador (F12)
- Los datos se guardan localmente como backup

### WhatsApp links no funcionan
- Asegúrate que números tengan formato internacional (+1...)
- Prueba en navegador móvil
- Abre en WhatsApp Web si es desde desktop

---

## 🚀 Roadmap (Próximas Mejoras)

- [ ] Integración real Twilio SMS
- [ ] WhatsApp Business API
- [ ] Programación de mensajes
- [ ] Analytics avanzadas
- [ ] Múltiples usuarios por negocio
- [ ] Integración con Google Business Profile
- [ ] Dashboard de ingresos (para ti)
- [ ] Sistema de facturación

---

## 📧 Soporte

Para issues o mejoras, contacta:
- **Email**: skyviewmarkplus@gmail.com
- **WhatsApp**: +786-508-3746

---

## 📄 Licencia

Creado para Sky View Mark+ © 2024
