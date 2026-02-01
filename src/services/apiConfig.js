/**
 * Configuração centralizada da API
 * Define a URL base e fornece funções reutilizáveis para requisições HTTP com autenticação JWT
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Função para obter o token JWT do localStorage
 * @returns {string|null} Token JWT ou null se não existir
 */
export const getAuthToken = () => {
  return localStorage.getItem('jwt_token');
};

/**
 * Função para fazer requisições autenticadas
 * Adiciona automaticamente o header de autorização JWT
 * 
 * @param {string} endpoint - O endpoint relativo (ex: '/clientes', '/auth/login')
 * @param {Object} options - Opções do fetch (method, body, etc)
 * @returns {Promise<Response>} Resposta do fetch
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona o token ao header Authorization se existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
};

/**
 * Função auxiliar para fazer GET
 * @param {string} endpoint - O endpoint relativo
 * @returns {Promise<Object>} Dados da resposta
 */
export const apiGet = async (endpoint) => {
  const response = await apiCall(endpoint, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Função auxiliar para fazer POST
 * @param {string} endpoint - O endpoint relativo
 * @param {Object} data - Dados a enviar no corpo da requisição
 * @returns {Promise<Object>} Dados da resposta
 */
export const apiPost = async (endpoint, data) => {
  const response = await apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Trata resposta como mapa de erros de validação
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          const errorMessages = Object.values(errorData);
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      // Se não conseguir fazer parse, usa a mensagem padrão
      console.error('Erro ao fazer parse do erro:', e);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Função auxiliar para fazer PUT
 * @param {string} endpoint - O endpoint relativo
 * @param {Object} data - Dados a enviar no corpo da requisição
 * @returns {Promise<Object>} Dados da resposta
 */
export const apiPut = async (endpoint, data) => {
  const response = await apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Trata resposta como mapa de erros de validação
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
          const errorMessages = Object.values(errorData);
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Erro ao fazer parse do erro:', e);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Função auxiliar para fazer DELETE
 * @param {string} endpoint - O endpoint relativo
 * @returns {Promise<void>}
 */
export const apiDelete = async (endpoint) => {
  const response = await apiCall(endpoint, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  // DELETE pode retornar 204 (No Content) sem body
  if (response.status === 204) {
    return;
  }

  return response.json();
};

export default {
  API_BASE_URL,
  getAuthToken,
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
