/**
 * Serviço de Objetivos
 * Fornece operações básicas para interagir com o backend de objetivos
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiConfig'

export const buscarTodosObjetivos = async (page = 0, size = 1000) => {
  try {
    // Usa endpoint /ativos que retorna lista simples de objetivos ativos
    const resp = await apiGet('/objetivos/ativos')
    return resp
  } catch (error) {
    console.error('Erro ao buscar objetivos (ativos):', error)
    throw error
  }
}

export const criarObjetivo = async (objetivoData) => {
  try {
    return await apiPost('/objetivos', objetivoData)
  } catch (error) {
    console.error('Erro ao criar objetivo:', error)
    throw error
  }
}

export const atualizarObjetivo = async (id, objetivoData) => {
  try {
    return await apiPut(`/objetivos/${id}`, objetivoData)
  } catch (error) {
    console.error(`Erro ao atualizar objetivo ${id}:`, error)
    throw error
  }
}

export const deletarObjetivo = async (id) => {
  try {
    return await apiDelete(`/objetivos/${id}`)
  } catch (error) {
    console.error(`Erro ao deletar objetivo ${id}:`, error)
    throw error
  }
}

export default {
  buscarTodosObjetivos,
  criarObjetivo,
  atualizarObjetivo,
  deletarObjetivo,
}
