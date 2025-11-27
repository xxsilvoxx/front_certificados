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

// Função para fazer requisições com tratamento de erro
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
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
      throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
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
  // Login com validação no backend
  async login(username, password) {
    try {
      const response = await fetchWithErrorHandling(`${API_BASE}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.success) {
        // Salva o token
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obter token
  getToken() {
    return localStorage.getItem('authToken');
  }
};

// Serviços da API principal
export const apiService = {
  // Health Check
  async healthCheck() {
    return await fetchWithErrorHandling(`${API_BASE}/health`);
  },

  // Eventos
  async getEventos() {
    return await fetchWithErrorHandling(`${API_BASE}/eventos`);
  },

  async createEvento(evento) {
    return await fetchWithErrorHandling(`${API_BASE}/eventos`, {
      method: 'POST',
      body: JSON.stringify(evento),
    });
  },

  async deleteEvento(id) {
    return await fetchWithErrorHandling(`${API_BASE}/eventos/${id}`, {
      method: 'DELETE',
    });
  },

  // Participantes
  async getParticipantes() {
    return await fetchWithErrorHandling(`${API_BASE}/participantes`);
  },

  async createParticipante(participante) {
    return await fetchWithErrorHandling(`${API_BASE}/participantes`, {
      method: 'POST',
      body: JSON.stringify(participante),
    });
  },

  async updateParticipanteFrequencia(id, frequencia) {
    return await fetchWithErrorHandling(`${API_BASE}/participantes/${id}/frequencia`, {
      method: 'PUT',
      body: JSON.stringify({ frequencia }),
    });
  },

  async deleteParticipante(id) {
    return await fetchWithErrorHandling(`${API_BASE}/participantes/${id}`, {
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
    console.warn('⚠️  Backend não disponível:', error.message);
    return false;
  }
};

export default apiService;