package br.com.phteam.consultoria.api.features.sessao.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoCriarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.response.SessaoResponseDTO;

public interface SessaoIService {

    SessaoResponseDTO save(SessaoCriarRequestDTO dto);

    List<SessaoResponseDTO> findAll();

    Page<SessaoResponseDTO> findAllPaged(Pageable pageable);

    SessaoResponseDTO findById(Long id);

    SessaoResponseDTO update(SessaoAtualizarRequestDTO dto);

    Long delete(Long id);

    List<SessaoResponseDTO> findByRotinaId(Long rotinaId);
}
