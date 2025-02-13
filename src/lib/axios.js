import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// Interceptor para adjuntar el token en cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("AUTH_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación (ej: token expirado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Sesión expirada. Redirigiendo al login...");
            localStorage.removeItem("AUTH_TOKEN");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;

