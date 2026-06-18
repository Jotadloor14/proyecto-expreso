const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTRAR UN NUEVO CHOFER/ADMIN
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password, rol, placa_asignada } = req.body;

        // Verificar si el correo ya existe en MongoDB Atlas
        let usuarioExiste = await Usuario.findOne({ correo });
        if (usuarioExiste) {
            return res.status(400).json({ ok: false, msg: 'El correo ya se encuentra registrado.' });
        }

        // Crear la instancia del usuario
        const nuevoUsuario = new Usuario({ nombre, correo, password, rol, placa_asignada });

        // ENCRIPTACIÓN DE CONTRASEÑA (Bcrypt)
        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);

        // Guardar en la nube
        await nuevoUsuario.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado exitosamente con contraseña segura.'
        });

    } catch (error) {
        console.error('Error en registrarUsuario:', error);
        res.status(500).json({ ok: false, msg: 'Error interno al registrar usuario.' });
    }
};

// 2. INICIAR SESIÓN (LOGIN)
exports.loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscar el usuario por correo
        const usuarioDB = await Usuario.findOne({ correo });
        if (!usuarioDB) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas (Correo no válido).' });
        }

        // Comparar la contraseña ingresada con el hash encriptado de la base de datos
        const passwordValido = await bcrypt.compare(password, usuarioDB.password);
        if (!passwordValido) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas (Contraseña no válida).' });
        }

        // GENERAR EL TOKEN JWT (Pase digital corporativo válido por 30 días)
        const token = jwt.sign(
            { id: usuarioDB._id, rol: usuarioDB.rol },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Responder con éxito enviando los datos públicos del usuario y su token
        res.status(200).json({
            ok: true,
            msg: 'Login exitoso',
            usuario: {
                id: usuarioDB._id,
                nombre: usuarioDB.nombre,
                rol: usuarioDB.rol,
            },
            token
        });

    } catch (error) {
        console.error('Error en loginUsuario:', error);
        res.status(500).json({ ok: false, msg: 'Error interno en el inicio de sesión.' });
    }
};
