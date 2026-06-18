const Viaje = require('../models/Viaje');

// 1. Iniciar un nuevo viaje en la base de datos
exports.iniciarViaje = async (req, res) => {
    try {
        // Recibimos los datos enviados desde el celular del chofer
        const { informacion_viaje, pasajeros_a_bordo } = req.body;

        // Validamos que vengan pasajeros en el bus
        if (!pasajeros_a_bordo || pasajeros_a_bordo.length === 0) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'No se puede iniciar un viaje sin pasajeros a bordo.' 
            });
        }

        // Lógica automática: Calculamos la cantidad de personas según la lista enviada
        informacion_viaje.cantidad_personas = pasajeros_a_bordo.length;

        // Creamos la instancia del modelo con los datos
        const nuevoViaje = new Viaje({
            informacion_viaje,
            pasajeros_a_bordo
        });

        // Guardamos en MongoDB Atlas de forma asíncrona
        await nuevoViaje.save();

        // Respondemos al celular con un código 211 (Creado) y el ID del viaje generado
        res.status(201).json({
            ok: true,
            msg: '¡Viaje iniciado con éxito en el sistema!',
            viajeId: nuevoViaje._id
        });

    } catch (error) {
        console.error('Error en iniciarViaje:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno en el servidor. Comuníquese con soporte.'
        });
    }
};

// 2. Registrar la firma digital de un pasajero específico durante el viaje
exports.registrarFirmaPasajero = async (req, res) => {
    try {
        const { viajeId, codigo_cedula, firma_base64 } = req.body;

        // Validamos que los datos necesarios vengan en la petición
        if (!viajeId || !codigo_cedula || !firma_base64) {
            return res.status(400).json({ ok: false, msg: 'Faltan datos obligatorios para firmar.' });
        }

        // Buscamos el viaje y actualizamos al pasajero que coincida con la cédula
        // Usamos el operador '$' de MongoDB para modificar solo el elemento correcto del arreglo
        const viajeActualizado = await Viaje.findOneAndUpdate(
            { _id: viajeId, "pasajeros_a_bordo.codigo_cedula": codigo_cedula },
            { $set: { "pasajeros_a_bordo.$.firma_base64": firma_base64 } },
            { new: true } // Nos devuelve el documento ya modificado
        );

        if (!viajeActualizado) {
            return res.status(404).json({ ok: false, msg: 'Viaje o Pasajero no encontrado en el sistema.' });
        }

        res.status(200).json({
            ok: true,
            msg: 'Firma del pasajero registrada exitosamente.'
        });

    } catch (error) {
        console.error('Error en registrarFirmaPasajero:', error);
        res.status(500).json({ ok: false, msg: 'Error al registrar la firma.' });
    }
};

// 3. Finalizar el viaje y registrar la hora de llegada automáticamente
exports.finalizarViaje = async (req, res) => {
    try {
        const { viajeId } = req.body;

        if (!viajeId) {
            return res.status(400).json({ ok: false, msg: 'El ID del viaje es requerido para finalizar.' });
        }

        // Capturamos la hora actual del servidor en formato HH:MM (Hora Ecuador)
        const ahora = new Date();
        const hora_llegada = ahora.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Actualizamos el campo 'hora_llegada' en la base de datos
        const viajeFinalizado = await Viaje.findByIdAndUpdate(
            viajeId,
            { $set: { "informacion_viaje.hora_llegada": hora_llegada } },
            { new: true }
        );

        if (!viajeFinalizado) {
            return res.status(404).json({ ok: false, msg: 'El viaje especificado no existe.' });
        }

        res.status(200).json({
            ok: true,
            msg: `Viaje finalizado con éxito a las ${hora_llegada}.`,
            viaje: viajeFinalizado
        });

    } catch (error) {
        console.error('Error en finalizarViaje:', error);
        res.status(500).json({ ok: false, msg: 'Error interno al finalizar el viaje.' });
    }
};
