const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoints públicos para control de accesos
router.post('/registro', authController.registrarUsuario);
router.post('/login', authController.loginUsuario);

module.exports = router;
