const mongoose = require('mongoose');

// Esquema para cada pasajero individual
const PasajeroSchema = new mongoose.Schema({
    codigo_cedula: { type: String, required: true },
    nombres: { type: String, required: true },
    cargo: { type: String, required: true },
    // Guardamos la firma como un string largo de texto (Base64)
    // Es opcional porque al inicio del viaje puede que falte o se llene después
    firma_base64: { type: String, default: null } 
});

// Esquema principal del Reporte de Viaje
const ViajeSchema = new mongoose.Schema({
    informacion_viaje: {
        ruta: { type: String, required: true }, // Ej: "Manta - Posorja"
        ida_retorno: { type: String, required: true }, // Ej: "RETORNO DE VIAJE DESDE PROVINCIA"
        expreso_nro: { type: Number, required: true },
        fecha: { type: String, required: true }, // Guardamos formato "YYYY-MM-DD"
        placa: { type: String, required: true },
        hora_salida: { type: String, required: true }, // Ej: "14:00"
        hora_llegada: { type: String, default: null }, // Se llena al finalizar el viaje
        chofer_nombre: { type: String, required: true },
        cantidad_personas: { type: Number, default: 0 }, // Se calculará con JS según los pasajeros que queden
        tipo_ruta: { type: String, enum: ['ENTRADA', 'SALIDA'], required: true } // Controla cuándo se firma
    },
    firmas_autorizacion: {
        rrhh: { type: String, default: "JHAEL ZHUNIO" },
        gerente_rrhh: { type: String, default: "ING. JUAN FERNANDO GUTIERREZ" },
        logistica: { type: String, default: "FRANCISCO PALMA" },
        proveedor: { type: String, default: "STEVEN JUPITER" }
    },
    // Ponemos el esquema de pasajeros dentro de un Arreglo [] porque van 30 o 40 por viaje
    pasajeros_a_bordo: [PasajeroSchema]
}, { 
    timestamps: true // Esto crea automáticamente la fecha de creación y actualización en MongoDB
});

module.exports = mongoose.model('Viaje', ViajeSchema);
