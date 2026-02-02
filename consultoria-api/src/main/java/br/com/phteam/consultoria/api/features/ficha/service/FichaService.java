package br.com.phteam.consultoria.api.features.ficha.service;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import br.com.phteam.consultoria.api.features.cliente.repository.ClienteRepository;
import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.response.FichaResponseDTO;
import br.com.phteam.consultoria.api.features.ficha.mapper.FichaMapper;
import br.com.phteam.consultoria.api.features.ficha.model.Ficha;
import br.com.phteam.consultoria.api.features.ficha.repository.FichaRepository;
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
public class FichaService implements FichaIService {

    private final FichaRepository repository;
    private final FichaMapper mapper;
    private final ClienteRepository clienteRepository;

    @Override
    @Transactional
    public FichaResponseDTO save(FichaCriarRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + dto.clienteId()));

        Ficha entity = mapper.toEntity(dto, cliente);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public List<FichaResponseDTO> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Page<FichaResponseDTO> findAllPaged(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public FichaResponseDTO findById(Long id) {
        Ficha f = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ficha não encontrada com ID: " + id));
        return mapper.toResponse(f);
    }

    @Override
    @Transactional
    public FichaResponseDTO update(FichaAtualizarRequestDTO dto) {
        Ficha f = repository.findById(dto.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ficha não encontrada com ID: " + dto.id()));

        if (dto.nome() != null) f.setNome(dto.nome());
        if (dto.objetivo() != null) f.setObjetivo(dto.objetivo());

        return mapper.toResponse(repository.save(f));
    }

    @Override
    @Transactional
    public Long delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Ficha não encontrada com ID: " + id);
        }

        repository.deleteById(id);
        return id;
    }
}
