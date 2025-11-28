[file name]: src/services/api.js
[file content begin]
// SOLUÇÃO DEFINITIVA - Usar variável de ambiente OU URL fixa
const API_BASE = import.meta.env.VITE_API_URL || 'https://back-certificados-3733.onrender.com/api';

console.log('🚀 API Config - URL DEFINITIVA:', API_BASE);
console.log('🔧 Variável de ambiente VITE_API_URL:', import.meta.env.VITE_API_URL);

// Função SIMPLIFICADA
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  console.log(`📡 Fazendo request para: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`💥 ERRO CRÍTICO em ${url}:`, error.message);
    throw new Error(`Falha na conexão: ${error.message}`);
  }
};

// Serviços SIMPLIFICADOS
export const apiService = {
  async healthCheck() {
    return await apiRequest('/health');
  },

  async getEventos() {
    return await apiRequest('/eventos');
  },

  async createEvento(evento) {
    return await apiRequest('/eventos', {
      method: 'POST',
      body: JSON.stringify(evento),
    });
  },

  async deleteEvento(id) {
    return await apiRequest(`/eventos/${id}`, {
      method: 'DELETE',
    });
  },

  async getParticipantes() {
    return await apiRequest('/participantes');
  },

  async createParticipante(participante) {
    return await apiRequest('/participantes', {
      method: 'POST',
      body: JSON.stringify(participante),
    });
  },

  async updateParticipanteFrequencia(id, frequencia) {
    return await apiRequest(`/participantes/${id}/frequencia`, {
      method: 'PUT',
      body: JSON.stringify({ frequencia }),
    });
  },

  async deleteParticipante(id) {
    return await apiRequest(`/participantes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Login direto
export const authService = {
  async login(username, password) {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('authToken', response.token);
      return response;
    } else {
      throw new Error(response.message);
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export default apiService;
[file content end]