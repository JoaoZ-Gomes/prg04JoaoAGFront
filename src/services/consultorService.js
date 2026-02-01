/**
 * Serviço de Consultores
 * Responsável por operações CRUD de consultores
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig';
import * as clienteService from './clienteService';

/**
 * Criar um novo consultor
 * @param {Object} consultorData - Dados do consultor
 * @returns {Promise<Object>} Dados do consultor criado
 */
export const criarConsultor = async (consultorData) => {
  try {
    return await apiPost('/consultores', consultorData);
  } catch (error) {
    console.error('Erro ao criar consultor:', error);
    throw error;
  }
};

/**
 * Buscar todos os consultores com paginação
 * @param {number} page - Número da página (padrão: 0)
 * @param {number} size - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de consultores
 */
export const buscarTodosConsultores = async (page = 0, size = 10) => {
  try {
    return await apiGet(`/consultores?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Erro ao buscar consultores:', error);
    throw error;
  }
};

/**
 * Buscar consultor por ID
 * @param {number} id - ID do consultor
 * @returns {Promise<Object>} Dados do consultor
 */
export const buscarConsultorPorId = async (id) => {
  try {
    return await apiGet(`/consultores/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar consultor ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar todos os clientes (para consultor logado)
 * Retorna a lista de TODOS os clientes do sistema
 * @returns {Promise<Array>} Lista de todos os clientes
 */
export const buscarMeusClientes = async () => {
  try {
    // Buscar todos os clientes sem paginação
    return await clienteService.buscarTodosClientesSemPaginacao();
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

/**
 * Atualizar dados do consultor
 * @param {number} id - ID do consultor
 * @param {Object} consultorData - Dados a atualizar
 * @returns {Promise<Object>} Dados do consultor atualizado
 */
export const atualizarConsultor = async (id, consultorData) => {
  try {
    return await apiPut(`/consultores/${id}`, consultorData);
  } catch (error) {
    console.error(`Erro ao atualizar consultor ${id}:`, error);
    throw error;
  }
};

/**
 * Deletar consultor
 * @param {number} id - ID do consultor
 * @returns {Promise<void>}
 */
export const deletarConsultor = async (id) => {
  try {
    return await apiDelete(`/consultores/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar consultor ${id}:`, error);
    throw error;
  }
};

export default {
  criarConsultor,
  buscarTodosConsultores,
  buscarConsultorPorId,
  buscarMeusClientes,
  atualizarConsultor,
  deletarConsultor,
};
