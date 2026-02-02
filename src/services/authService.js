/**
 * Serviço de Autenticação
 * Responsável por login, logout e gerenciamento de sessão
 */

import { apiPost } from './apiConfig';

/**
 * Realiza login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} {token, email, tipoUsuario}
 */
export const login = async (email, senha) => {
  try {
    const response = await apiPost('/auth/login', { email, senha });
    
    // Armazena os dados no localStorage
    if (response.token) {
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('user_email', response.email);
      localStorage.setItem('user_role', response.tipoUsuario);
    }
    
    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Realiza logout do usuário
 * Limpa o localStorage
 */
export const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
};

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} true se autenticado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('jwt_token');
};

/**
 * Obter o role do usuário logado
 * @returns {string|null} 'Cliente', 'Consultor' ou null
 */
export const getUserRole = () => {
  return localStorage.getItem('user_role');
};

/**
 * Obter o email do usuário logado
 * @returns {string|null} Email do usuário
 */
export const getUserEmail = () => {
  return localStorage.getItem('user_email');
};

/**
 * Obter o ID do usuário logado (se armazenado)
 * @returns {string|null} ID do usuário
 */
export const getUserId = () => {
  return localStorage.getItem('user_id');
};

/**
 * Obter dados completos do usuário logado
 * @returns {Object|null} {email, role, id} do usuário ou null
 */
export const getUser = () => {
  if (!isAuthenticated()) {
    return null;
  }

  return {
    email: getUserEmail(),
    role: getUserRole(),
    id: getUserId(),
  };
};

/**
 * Armazenar o ID do usuário no localStorage
 * Útil para chamadas de API subsequentes
 * @param {number|string} id - ID do usuário
 */
export const setUserId = (id) => {
  localStorage.setItem('user_id', id);
};

export default {
  login,
  logout,
  isAuthenticated,
  getUserRole,
  getUserEmail,
  getUserId,
  getUser,
  setUserId,
};
