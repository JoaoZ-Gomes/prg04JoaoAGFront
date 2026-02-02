package br.com.phteam.consultoria.api.features.rotina.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.phteam.consultoria.api.features.rotina.dto.request.RotinaAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.rotina.dto.request.RotinaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.rotina.dto.response.RotinaResponseDTO;

public interface RotinaIService {

    RotinaResponseDTO save(RotinaCriarRequestDTO dto);

    List<RotinaResponseDTO> findAll();

    Page<RotinaResponseDTO> findAllPaged(Pageable pageable);

    RotinaResponseDTO findById(Long id);

    RotinaResponseDTO update(RotinaAtualizarRequestDTO dto);

    Long delete(Long id);

    List<RotinaResponseDTO> findByFichaId(Long fichaId);
}
