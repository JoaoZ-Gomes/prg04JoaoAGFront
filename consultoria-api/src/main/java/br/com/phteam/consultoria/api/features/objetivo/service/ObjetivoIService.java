package br.com.phteam.consultoria.api.features.objetivo.service;

import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;
import br.com.phteam.consultoria.api.infrastructure.exception.RegraDeNegocioException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoRequestDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoResponseDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoUpdateDTO;

import java.util.List;

/**
 * Interface de serviço para operações de Objetivo.
 * Define os contratos para manipulação de objetivos na aplicação.
 */
public interface ObjetivoIService {

    // =====================================================
    // CREATE
    // =====================================================

    /**
     * Cria um novo objetivo.
     *
     * @param dto os dados do objetivo a ser criado
     * @return ObjetivoResponseDTO com o objetivo criado
     * @throws RegraDeNegocioException se o tipo já existe
     */
    ObjetivoResponseDTO criar(ObjetivoRequestDTO dto);

    // =====================================================
    // READ
    // =====================================================

    /**
     * Lista todos os objetivos com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return Page contendo objetivos encontrados
     */
    Page<ObjetivoResponseDTO> listarTodos(Pageable pageable);

    /**
     * Lista apenas os objetivos ativos.
     *
     * @return lista de objetivos ativos
     */
    List<ObjetivoResponseDTO> listarAtivos();

    /**
     * Busca um objetivo pelo ID.
     *
     * @param id o identificador do objetivo
     * @return ObjetivoResponseDTO com os dados do objetivo
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    ObjetivoResponseDTO buscarPorId(Long id);

    // =====================================================
    // UPDATE
    // =====================================================

    /**
     * Atualiza um objetivo existente.
     *
     * @param id  o identificador do objetivo
     * @param dto os dados para atualização
     * @return ObjetivoResponseDTO com o objetivo atualizado
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    ObjetivoResponseDTO atualizar(Long id, ObjetivoUpdateDTO dto);

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um objetivo pelo ID.
     *
     * @param id o identificador do objetivo a ser deletado
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    void deletar(Long id);

    // =====================================================
    // PATCH - DESATIVAR
    // =====================================================

    /**
     * Desativa um objetivo sem deletar.
     *
     * @param id o identificador do objetivo a ser desativado
     * @return ObjetivoResponseDTO com o objetivo atualizado
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    ObjetivoResponseDTO desativar(Long id);

    // =====================================================
    // PATCH - ATIVAR
    // =====================================================

    /**
     * Ativa um objetivo.
     *
     * @param id o identificador do objetivo a ser ativado
     * @return ObjetivoResponseDTO com o objetivo atualizado
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    ObjetivoResponseDTO ativar(Long id);
}
