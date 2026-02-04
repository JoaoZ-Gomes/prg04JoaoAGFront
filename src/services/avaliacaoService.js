import { apiGet, apiPost } from './apiConfig'

/**
 * Buscar avaliações do cliente autenticado
 */
export const buscarMinhasAvaliacoes = async () => {
  try {
    return await apiGet('/avaliacoes/meu')
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    throw error
  }
}

export default {
  buscarMinhasAvaliacoes,
}

export const criarAvaliacao = async (payload) => {
  try {
    return await apiPost('/avaliacoes', payload)
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    throw error
  }
}

export const buscarAvaliacoesMeusClientes = async () => {
  try {
    return await apiGet('/avaliacoes/consultor')
  } catch (error) {
    console.error('Erro ao buscar avaliações dos clientes do consultor:', error)
    throw error
  }
}
