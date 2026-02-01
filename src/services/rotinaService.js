/**
 * Serviço de Rotinas
 * Responsável por operações CRUD de rotinas de treino
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig';

/**
 * Criar uma nova rotina
 * @param {Object} rotinaData - Dados da rotina
 * @returns {Promise<Object>} Dados da rotina criada
 */
export const criarRotina = async (rotinaData) => {
  try {
    return await apiPost('/rotinas', rotinaData);
  } catch (error) {
    console.error('Erro ao criar rotina:', error);
    throw error;
  }
};

/**
 * Buscar todas as rotinas com paginação
 * @param {number} page - Número da página (padrão: 0)
 * @param {number} size - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de rotinas
 */
export const buscarTodasRotinas = async (page = 0, size = 10) => {
  try {
    return await apiGet(`/rotinas?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Erro ao buscar rotinas:', error);
    throw error;
  }
};

/**
 * Buscar todas as rotinas (sem paginação)
 * Útil para listas simples ou comboboxes
 * @returns {Promise<Array>} Array de todas as rotinas
 */
export const buscarTodasRotinasSemPaginacao = async () => {
  try {
    return await apiGet('/rotinas/all');
  } catch (error) {
    console.error('Erro ao buscar todas as rotinas:', error);
    throw error;
  }
};

/**
 * Buscar rotina por ID
 * @param {number} id - ID da rotina
 * @returns {Promise<Object>} Dados da rotina
 */
export const buscarRotinaPorId = async (id) => {
  try {
    return await apiGet(`/rotinas/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar rotina ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar rotinas por ID da ficha
 * @param {number} fichaId - ID da ficha
 * @returns {Promise<Array>} Array de rotinas da ficha
 */
export const buscarRotinasPorFicha = async (fichaId) => {
  try {
    return await apiGet(`/rotinas/ficha/${fichaId}`);
  } catch (error) {
    console.error(`Erro ao buscar rotinas da ficha ${fichaId}:`, error);
    throw error;
  }
};

/**
 * Atualizar dados da rotina
 * @param {number} id - ID da rotina
 * @param {Object} rotinaData - Dados a atualizar
 * @returns {Promise<Object>} Dados da rotina atualizada
 */
export const atualizarRotina = async (id, rotinaData) => {
  try {
    return await apiPut(`/rotinas/${id}`, rotinaData);
  } catch (error) {
    console.error(`Erro ao atualizar rotina ${id}:`, error);
    throw error;
  }
};

/**
 * Deletar rotina
 * @param {number} id - ID da rotina
 * @returns {Promise<void>}
 */
export const deletarRotina = async (id) => {
  try {
    return await apiDelete(`/rotinas/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar rotina ${id}:`, error);
    throw error;
  }
};

export default {
  criarRotina,
  buscarTodasRotinas,
  buscarTodasRotinasSemPaginacao,
  buscarRotinaPorId,
  buscarRotinasPorFicha,
  atualizarRotina,
  deletarRotina,
};
