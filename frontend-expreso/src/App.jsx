import React, { useState } from 'react';
import Login from './pages/Login';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Función que se ejecuta cuando el login es correcto
  const manejarLoginExitoso = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  // Si no hay usuario logueado, forzar la pantalla de Login
  if (!usuario) {
    return <Login onLoginSuccess={manejarLoginExitoso} />;
  }

  // Si ya inició sesión con éxito, mostramos la interfaz interna temporal
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">¡Bienvenido, {usuario.nombre}!</h2>
        <p className="text-slate-400">Rol asignado: <span className="text-slate-200 font-semibold">{usuario.rol}</span></p>
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500 text-emerald-300 rounded-lg text-sm">
          Has accedido al sistema en la nube con éxito de forma segura.
        </div>
      </div>
    </div>
  );
}

export default App;
