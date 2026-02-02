package br.com.phteam.consultoria.api.features.objetivo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoRequestDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoResponseDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoUpdateDTO;
import br.com.phteam.consultoria.api.features.objetivo.mapper.ObjetivoMapper;
import br.com.phteam.consultoria.api.features.objetivo.model.Objetivo;
import br.com.phteam.consultoria.api.features.objetivo.repository.ObjetivoRepository;
import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;
import br.com.phteam.consultoria.api.infrastructure.exception.RegraDeNegocioException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ObjetivoService implements ObjetivoIService {

    private final ObjetivoRepository repository;
    private final ObjetivoMapper mapper;

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
    @Override
    public ObjetivoResponseDTO criar(ObjetivoRequestDTO dto) {
        if (repository.findByTipo(dto.tipo()) != null) {
            throw new RegraDeNegocioException("Objetivo do tipo " + dto.tipo() + " já existe.");
        }

        Objetivo objetivo = mapper.toEntity(dto);
        return mapper.toResponseDTO(repository.save(objetivo));
    }

    // =====================================================
    // READ
    // =====================================================

    /**
     * Lista todos os objetivos com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return Page contendo objetivos encontrados
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ObjetivoResponseDTO> listarTodos(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }

    /**
     * Lista apenas os objetivos ativos.
     *
     * @return lista de objetivos ativos
     */
    @Override
    @Transactional(readOnly = true)
    public List<ObjetivoResponseDTO> listarAtivos() {
        return repository.findByAtivoTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    /**
     * Busca um objetivo pelo ID.
     *
     * @param id o identificador do objetivo
     * @return ObjetivoResponseDTO com os dados do objetivo
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    @Override
    @Transactional(readOnly = true)
    public ObjetivoResponseDTO buscarPorId(Long id) {
        Objetivo objetivo = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Objetivo não encontrado: " + id));
        return mapper.toResponseDTO(objetivo);
    }

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
    @Override
    public ObjetivoResponseDTO atualizar(Long id, ObjetivoUpdateDTO dto) {
        Objetivo objetivo = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Objetivo não encontrado: " + id));

        mapper.updateEntityFromDTO(dto, objetivo);

        return mapper.toResponseDTO(repository.save(objetivo));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um objetivo pelo ID.
     *
     * @param id o identificador do objetivo a ser deletado
     * @throws RecursoNaoEncontradoException se o objetivo não existe
     */
    @Override
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Objetivo não encontrado: " + id);
        }
        repository.deleteById(id);
    }

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
    @Override
    public ObjetivoResponseDTO desativar(Long id) {
        Objetivo objetivo = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Objetivo não encontrado: " + id));

        objetivo.setAtivo(false);
        return mapper.toResponseDTO(repository.save(objetivo));
    }

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
    @Override
    public ObjetivoResponseDTO ativar(Long id) {
        Objetivo objetivo = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Objetivo não encontrado: " + id));

        objetivo.setAtivo(true);
        return mapper.toResponseDTO(repository.save(objetivo));
    }
}
