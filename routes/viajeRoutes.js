const express = require('express');
const router = express.Router();
const viajeController = require('../controllers/viajeController');

// ========================================================
// RUTAS DE LA API PARA LA APLICACIÓN MÓVIL Y WEB
// ========================================================

// 1. Iniciar un nuevo viaje (Crea el registro del bus)
router.post('/iniciar', viajeController.iniciarViaje);

// 2. Registrar la firma de un pasajero (Modifica el viaje agregando firmas)
router.put('/firmar', viajeController.registrarFirmaPasajero);

// 3. Finalizar el viaje (Cambia el estado del viaje a terminado)
router.put('/finalizar', viajeController.finalizarViaje);

module.exports = router;
