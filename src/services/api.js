// Configuração dinâmica da API base
const getApiBaseUrl = () => {
  // Em produção, usa a URL do Render
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://back-certificados-3733.onrender.com/api';
  }
  // Em desenvolvimento, usa localhost
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBaseUrl();

console.log('🔧 Configuração API:', {
  baseURL: API_BASE,
  environment: import.meta.env.MODE
});

// ... resto do seu código existente ...