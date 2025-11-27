// Configuração dinâmica da API base
const getApiBaseUrl = () => {
  // Se estiver em produção e tiver uma URL definida
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Em desenvolvimento, usa localhost
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBaseUrl();

console.log('🔧 Configuração API:', {
  baseURL: API_BASE,
  environment: import.meta.env.MODE,
  prod: import.meta.env.PROD
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