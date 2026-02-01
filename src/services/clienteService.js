/**
 * Serviço de Clientes
 * Responsável por operações CRUD de clientes
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig';

/**
 * Criar um novo cliente
 * @param {Object} clienteData - Dados do cliente
 * @returns {Promise<Object>} Dados do cliente criado
 */
export const criarCliente = async (clienteData) => {
  try {
    return await apiPost('/clientes', clienteData);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

/**
 * Buscar todos os clientes com paginação
 * @param {number} page - Número da página (padrão: 0)
 * @param {number} size - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de clientes
 */
export const buscarTodosClientes = async (page = 0, size = 10) => {
  try {
    return await apiGet(`/clientes?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Buscar todos os clientes sem paginação
 * @returns {Promise<Array>} Lista de todos os clientes
 */
export const buscarTodosClientesSemPaginacao = async () => {
  try {
    const response = await apiGet('/clientes?size=1000');
    // Se for paginado, retorna o content, senão retorna direto
    return response.content || response;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Buscar cliente por ID
 * @param {number} id - ID do cliente
 * @returns {Promise<Object>} Dados do cliente
 */
export const buscarClientePorId = async (id) => {
  try {
    return await apiGet(`/clientes/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar dados do cliente logado (seu perfil)
 * Usa o endpoint /meu-perfil que requer autenticação
 * @returns {Promise<Object>} Dados do cliente logado
 */
export const buscarMeuPerfil = async () => {
  try {
    return await apiGet('/clientes/meu-perfil');
  } catch (error) {
    console.error('Erro ao buscar perfil do cliente:', error);
    throw error;
  }
};

/**
 * Atualizar dados do cliente
 * @param {number} id - ID do cliente
 * @param {Object} clienteData - Dados a atualizar
 * @returns {Promise<Object>} Dados do cliente atualizado
 */
export const atualizarCliente = async (id, clienteData) => {
  try {
    return await apiPut(`/clientes/${id}`, clienteData);
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error);
    throw error;
  }
};

/**
 * Deletar cliente
 * @param {number} id - ID do cliente
 * @returns {Promise<void>}
 */
export const deletarCliente = async (id) => {
  try {
    return await apiDelete(`/clientes/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar cliente ${id}:`, error);
    throw error;
  }
};

export default {
  criarCliente,
  buscarTodosClientes,
  buscarClientePorId,
  buscarMeuPerfil,
  atualizarCliente,
  deletarCliente,
};
