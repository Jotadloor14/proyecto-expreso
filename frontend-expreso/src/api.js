import axios from 'axios';

const api = axios.create({
    //  URL REAL DE RENDER
    baseURL: 'https://proyecto-expreso.onrender.com',
    timeout: 10000, // Si el servidor tarda más de 10s (Render gratis a veces duerme), da alerta
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
