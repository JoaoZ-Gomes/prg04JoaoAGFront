package br.com.phteam.consultoria.api.features.rotina.service;

import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;
import br.com.phteam.consultoria.api.features.exercicio.repository.ExercicioRepository;
import br.com.phteam.consultoria.api.features.ficha.model.Ficha;
import br.com.phteam.consultoria.api.features.ficha.repository.FichaRepository;
import br.com.phteam.consultoria.api.features.rotina.dto.request.RotinaAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.rotina.dto.request.RotinaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.rotina.dto.response.RotinaResponseDTO;
import br.com.phteam.consultoria.api.features.rotina.mapper.RotinaMapper;
import br.com.phteam.consultoria.api.features.rotina.model.Rotina;
import br.com.phteam.consultoria.api.features.rotina.repository.RotinaRepository;
import br.com.phteam.consultoria.api.infrastructure.exception.RecursoNaoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RotinaService implements RotinaIService {

    private final RotinaRepository repository;
    private final RotinaMapper mapper;
    private final FichaRepository fichaRepository;
    private final ExercicioRepository exercicioRepository;

    @Override
    @Transactional
    public RotinaResponseDTO save(RotinaCriarRequestDTO dto) {
        Ficha ficha = fichaRepository.findById(dto.fichaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ficha não encontrada com ID: " + dto.fichaId()));

        Exercicio exercicio = exercicioRepository.findById(dto.exercicioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Exercício não encontrado com ID: " + dto.exercicioId()));

        Rotina r = mapper.toEntity(dto, ficha, exercicio);
        return mapper.toResponse(repository.save(r));
    }

    @Override
    public List<RotinaResponseDTO> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Page<RotinaResponseDTO> findAllPaged(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public RotinaResponseDTO findById(Long id) {
        Rotina r = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Rotina não encontrada com ID: " + id));
        return mapper.toResponse(r);
    }

    @Override
    @Transactional
    public RotinaResponseDTO update(RotinaAtualizarRequestDTO dto) {
        Rotina r = repository.findById(dto.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Rotina não encontrada com ID: " + dto.id()));

        if (dto.fichaId() != null) {
            Ficha ficha = fichaRepository.findById(dto.fichaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Ficha não encontrada com ID: " + dto.fichaId()));
            r.setFicha(ficha);
        }

        if (dto.exercicioId() != null) {
            Exercicio ex = exercicioRepository.findById(dto.exercicioId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Exercício não encontrado com ID: " + dto.exercicioId()));
            r.setExercicio(ex);
        }

        if (dto.nome() != null) r.setNome(dto.nome());
        if (dto.series() != null) r.setSeries(dto.series());
        if (dto.repeticoes() != null) r.setRepeticoes(dto.repeticoes());

        return mapper.toResponse(repository.save(r));
    }

    @Override
    @Transactional
    public Long delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Rotina não encontrada com ID: " + id);
        }
        repository.deleteById(id);
        return id;
    }

    @Override
    public List<RotinaResponseDTO> findByFichaId(Long fichaId) {
        return repository.findByFichaId(fichaId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}
