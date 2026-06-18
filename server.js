require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🚀 ¡Conectado exitosamente a MongoDB Atlas!'))
    .catch((error) => console.error('❌ Error de conexión a MongoDB:', error));

// ==========================================
// CAPAS DE RUTAS DE LA API
// ==========================================
app.use('/api/viajes', require('./routes/viajeRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // <-- NUEVA CAPA DE SEGURIDAD

app.listen(PORT, () => {
    console.log(`Servidor profesional escuchando en http://localhost:${PORT}`);
});
