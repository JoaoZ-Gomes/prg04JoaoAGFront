package br.com.phteam.consultoria.api.features.exercicio.service;

import br.com.phteam.consultoria.api.features.exercicio.dto.request.ExercicioAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.exercicio.dto.request.ExercicioCriarRequestDTO;
import br.com.phteam.consultoria.api.features.exercicio.dto.response.ExercicioResponseDTO;
import br.com.phteam.consultoria.api.features.exercicio.mapper.ExercicioMapper;

import br.com.phteam.consultoria.api.features.exercicio.repository.ExercicioRepository;
import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;
import br.com.phteam.consultoria.api.infrastructure.exception.RegraDeNegocioException;
import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExercicioService implements ExercicioIService {

    private final ExercicioRepository repository;
    private final ExercicioMapper mapper;

    @Override
    @Transactional
    public ExercicioResponseDTO save(ExercicioCriarRequestDTO dto) {

        if (repository.findByNome(dto.nome()).isPresent()) {
            throw new RegraDeNegocioException("Já existe um exercício com esse nome.");
        }

        Exercicio entity = mapper.toEntity(dto);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public List<ExercicioResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public Page<ExercicioResponseDTO> findAllPaged(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toResponse);
    }

    @Override
    public ExercicioResponseDTO findById(Long id) {
        Exercicio entity = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Exercício não encontrado com ID: " + id));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public ExercicioResponseDTO update(ExercicioAtualizarRequestDTO dto) {

        Exercicio entity = repository.findById(dto.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Exercício não encontrado com ID: " + dto.id()));

        entity.setNome(dto.nome());
        entity.setGrupoMuscular(dto.grupoMuscular());
        entity.setEquipamento(dto.equipamento());
        entity.setUrlVideo(dto.urlVideo());
        entity.setDescricao(dto.descricao());

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public Long delete(Long id) {

        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Exercício não encontrado com ID: " + id);
        }

        repository.deleteById(id);
        return id;
    }
}
