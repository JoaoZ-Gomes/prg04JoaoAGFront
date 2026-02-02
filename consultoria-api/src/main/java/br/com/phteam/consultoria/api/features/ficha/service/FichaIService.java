package br.com.phteam.consultoria.api.features.ficha.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.response.FichaResponseDTO;

public interface FichaIService {

    FichaResponseDTO save(FichaCriarRequestDTO dto);

    List<FichaResponseDTO> findAll();

    Page<FichaResponseDTO> findAllPaged(Pageable pageable);

    FichaResponseDTO findById(Long id);

    FichaResponseDTO update(FichaAtualizarRequestDTO dto);

    Long delete(Long id);
}
