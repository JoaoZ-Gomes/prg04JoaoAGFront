/**
 * Serviço de Fichas
 * Responsável por operações CRUD de fichas de treino
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig';

/**
 * Criar uma nova ficha
 * @param {Object} fichaData - Dados da ficha
 * @returns {Promise<Object>} Dados da ficha criada
 */
export const criarFicha = async (fichaData) => {
  try {
    return await apiPost('/fichas', fichaData);
  } catch (error) {
    console.error('Erro ao criar ficha:', error);
    throw error;
  }
};

/**
 * Buscar todas as fichas com paginação
 * @param {number} page - Número da página (padrão: 0)
 * @param {number} size - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de fichas
 */
export const buscarTodasFichas = async (page = 0, size = 10) => {
  try {
    return await apiGet(`/fichas?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Erro ao buscar fichas:', error);
    throw error;
  }
};

/**
 * Buscar todas as fichas (sem paginação)
 * Útil para listas simples ou comboboxes
 * @returns {Promise<Array>} Array de todas as fichas
 */
export const buscarTodasFichasSemPaginacao = async () => {
  try {
    return await apiGet('/fichas/all');
  } catch (error) {
    console.error('Erro ao buscar todas as fichas:', error);
    throw error;
  }
};

/**
 * Buscar ficha por ID
 * @param {number} id - ID da ficha
 * @returns {Promise<Object>} Dados da ficha
 */
export const buscarFichaPorId = async (id) => {
  try {
    return await apiGet(`/fichas/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar ficha ${id}:`, error);
    throw error;
  }
};

/**
 * Atualizar dados da ficha
 * @param {number} id - ID da ficha
 * @param {Object} fichaData - Dados a atualizar
 * @returns {Promise<Object>} Dados da ficha atualizada
 */
export const atualizarFicha = async (id, fichaData) => {
  try {
    console.log(`Atualizando ficha ${id} com dados:`, fichaData)
    const response = await apiPut(`/fichas/${id}`, fichaData)
    console.log(`Resposta da atualização de ficha ${id}:`, response)
    return response
  } catch (error) {
    console.error(`Erro ao atualizar ficha ${id}:`, error)
    throw error
  }
};

/**
 * Deletar ficha
 * @param {number} id - ID da ficha
 * @returns {Promise<void>}
 */
export const deletarFicha = async (id) => {
  try {
    return await apiDelete(`/fichas/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar ficha ${id}:`, error);
    throw error;
  }
};

export default {
  criarFicha,
  buscarTodasFichas,
  buscarTodasFichasSemPaginacao,
  buscarFichaPorId,
  atualizarFicha,
  deletarFicha,
};
