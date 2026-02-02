package br.com.phteam.consultoria.api.features.exercicio.service;

import br.com.phteam.consultoria.api.features.exercicio.dto.request.ExercicioCriarRequestDTO;
import br.com.phteam.consultoria.api.features.exercicio.dto.request.ExercicioAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.exercicio.dto.response.ExercicioResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExercicioIService {

    /**
     * Cadastra um novo exercício no catálogo.
     */
    ExercicioResponseDTO save(ExercicioCriarRequestDTO dto);

    /**
     * Lista todos os exercícios (sem paginação).
     */
    List<ExercicioResponseDTO> findAll();

    /**
     * Lista todos os exercícios com paginação.
     */
    Page<ExercicioResponseDTO> findAllPaged(Pageable pageable);

    /**
     * Busca um exercício pelo ID.
     */
    ExercicioResponseDTO findById(Long id);

    /**
     * Atualiza os dados de um exercício.
     */
    ExercicioResponseDTO update(ExercicioAtualizarRequestDTO dto);

    /**
     * Remove um exercício do sistema.
     */
    Long delete(Long id);
}
