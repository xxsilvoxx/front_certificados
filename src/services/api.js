[file name]: src/services/api.js
[file content begin]
// Configuração da API - SEMPRE usar a URL do Render
const getApiBaseUrl = () => {
  // Em produção (Vercel) ou desenvolvimento, usa a URL do Render
  return 'https://back-certificados-3733.onrender.com/api';
};

const API_BASE = getApiBaseUrl();

console.log('🔧 Configuração API:', {
  baseURL: API_BASE,
  environment: import.meta.env.MODE
});

// Função para fazer requisições com tratamento de erro
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const fullUrl = `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;
    
    console.log(`🌐 Fazendo requisição para: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `Erro HTTP: ${response.status}` };
      }
      throw new Error(errorData.error || errorData.message || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Erro na requisição:', {
      url,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Serviços de autenticação
export const authService = {
  async login(username, password) {
    try {
      const response = await fetchWithErrorHandling('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('authToken');
  }
};

// Serviços da API principal
export const apiService = {
  async healthCheck() {
    return await fetchWithErrorHandling('/health');
  },

  async getEventos() {
    return await fetchWithErrorHandling('/eventos');
  },

  async createEvento(evento) {
    return await fetchWithErrorHandling('/eventos', {
      method: 'POST',
      body: JSON.stringify(evento),
    });
  },

  async deleteEvento(id) {
    return await fetchWithErrorHandling(`/eventos/${id}`, {
      method: 'DELETE',
    });
  },

  async getParticipantes() {
    return await fetchWithErrorHandling('/participantes');
  },

  async createParticipante(participante) {
    return await fetchWithErrorHandling('/participantes', {
      method: 'POST',
      body: JSON.stringify(participante),
    });
  },

  async updateParticipanteFrequencia(id, frequencia) {
    return await fetchWithErrorHandling(`/participantes/${id}/frequencia`, {
      method: 'PUT',
      body: JSON.stringify({ frequencia }),
    });
  },

  async deleteParticipante(id) {
    return await fetchWithErrorHandling(`/participantes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Teste de conexão na inicialização
export const testConnection = async () => {
  try {
    const health = await apiService.healthCheck();
    console.log('✅ Conexão com backend estabelecida:', health);
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com backend:', error.message);
    return false;
  }
};

export default apiService;
[file content end]