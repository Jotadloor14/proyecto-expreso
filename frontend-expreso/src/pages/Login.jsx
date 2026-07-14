import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLoginSuccess }) => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setCargando(true);

        try {
            // Petición POST real a tu servidor en internet
            const respuesta = await api.post('/auth/login', { correo, password });
            
            if (respuesta.data.ok) {
                // Guardamos el Token en el almacenamiento del celular por seguridad empresarial
                localStorage.setItem('token', respuesta.data.token);
                // Pasamos los datos del usuario logueado al estado global de la app
                onLoginSuccess(respuesta.data.usuario);
            }
        } catch (err) {
            console.error(err);
            // Capturamos el error exacto que envía nuestro backend
            setError(err.response?.data?.msg || 'Error de conexión con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
                
                {/* Encabezado Corporativo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-amber-500 tracking-wide">EXPRESO ESCOLAR</h1>
                    <p className="text-slate-400 text-sm mt-2">Control de Rutas y Firmas Digitales</p>
                </div>

                {/* Mensaje de Error dinámico */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Correo Electrónico</label>
                        <input 
                            type="email" 
                            required
                            placeholder="ejemplo@expreso.com"
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Contraseña</label>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-95 text-base"
                    >
                        {cargando ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;
