/**
 * Serviço de Exercícios
 * Responsável por operações CRUD de exercícios
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig';

/**
 * Criar um novo exercício
 * @param {Object} exercicioData - Dados do exercício
 * @returns {Promise<Object>} Dados do exercício criado
 */
export const criarExercicio = async (exercicioData) => {
  try {
    return await apiPost('/exercicios', exercicioData);
  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    throw error;
  }
};

/**
 * Buscar todos os exercícios com paginação
 * @param {number} page - Número da página (padrão: 0)
 * @param {number} size - Tamanho da página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de exercícios
 */
export const buscarTodosExercicios = async (page = 0, size = 10) => {
  try {
    return await apiGet(`/exercicios?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    throw error;
  }
};

/**
 * Buscar todos os exercícios (sem paginação)
 * Útil para listas simples ou comboboxes
 * @returns {Promise<Array>} Array de todos os exercícios
 */
export const buscarTodosExerciciosSemPaginacao = async () => {
  try {
    return await apiGet('/exercicios/all');
  } catch (error) {
    console.error('Erro ao buscar todos os exercícios:', error);
    throw error;
  }
};

/**
 * Buscar exercício por ID
 * @param {number} id - ID do exercício
 * @returns {Promise<Object>} Dados do exercício
 */
export const buscarExercicioPorId = async (id) => {
  try {
    return await apiGet(`/exercicios/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar exercício ${id}:`, error);
    throw error;
  }
};

/**
 * Atualizar dados do exercício
 * @param {number} id - ID do exercício
 * @param {Object} exercicioData - Dados a atualizar
 * @returns {Promise<Object>} Dados do exercício atualizado
 */
export const atualizarExercicio = async (id, exercicioData) => {
  try {
    return await apiPut(`/exercicios/${id}`, exercicioData);
  } catch (error) {
    console.error(`Erro ao atualizar exercício ${id}:`, error);
    throw error;
  }
};

/**
 * Deletar exercício
 * @param {number} id - ID do exercício
 * @returns {Promise<void>}
 */
export const deletarExercicio = async (id) => {
  try {
    return await apiDelete(`/exercicios/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar exercício ${id}:`, error);
    throw error;
  }
};

export default {
  criarExercicio,
  buscarTodosExercicios,
  buscarTodosExerciciosSemPaginacao,
  buscarExercicioPorId,
  atualizarExercicio,
  deletarExercicio,
};
