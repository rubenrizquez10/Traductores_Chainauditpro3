// Configuración de la API
// En producción, las rutas de API son relativas al mismo servidor
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper para construir URLs de endpoints
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;
