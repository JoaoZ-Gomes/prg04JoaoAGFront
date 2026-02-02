package br.com.phteam.consultoria.api.features.sessao.service;

import br.com.phteam.consultoria.api.features.rotina.model.Rotina;
import br.com.phteam.consultoria.api.features.rotina.repository.RotinaRepository;
import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoCriarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.response.SessaoResponseDTO;
import br.com.phteam.consultoria.api.features.sessao.mapper.SessaoMapper;
import br.com.phteam.consultoria.api.features.sessao.model.Sessao;
import br.com.phteam.consultoria.api.features.sessao.repository.SessaoRepository;
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
public class SessaoService implements SessaoIService {

    private final SessaoRepository repository;
    private final SessaoMapper mapper;
    private final RotinaRepository rotinaRepository;

    @Override
    @Transactional
    public SessaoResponseDTO save(SessaoCriarRequestDTO dto) {
        Rotina rotina = rotinaRepository.findById(dto.rotinaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Rotina não encontrada com ID: " + dto.rotinaId()));

        Sessao s = mapper.toEntity(dto, rotina);
        return mapper.toResponse(repository.save(s));
    }

    @Override
    public List<SessaoResponseDTO> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Page<SessaoResponseDTO> findAllPaged(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public SessaoResponseDTO findById(Long id) {
        Sessao s = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sessão não encontrada com ID: " + id));
        return mapper.toResponse(s);
    }

    @Override
    @Transactional
    public SessaoResponseDTO update(SessaoAtualizarRequestDTO dto) {
        Sessao s = repository.findById(dto.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sessão não encontrada com ID: " + dto.id()));

        if (dto.dataSessao() != null) s.setDataSessao(dto.dataSessao());
        if (dto.observacoes() != null) s.setObservacoes(dto.observacoes());
        if (dto.status() != null) s.setStatus(dto.status());

        return mapper.toResponse(repository.save(s));
    }

    @Override
    @Transactional
    public Long delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Sessão não encontrada com ID: " + id);
        }
        repository.deleteById(id);
        return id;
    }

    @Override
    public List<SessaoResponseDTO> findByRotinaId(Long rotinaId) {
        return repository.findByRotinaId(rotinaId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}
