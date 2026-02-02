package br.com.phteam.consultoria.api.features.objetivo.mapper;

import org.springframework.stereotype.Component;

import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoRequestDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoResponseDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoUpdateDTO;
import br.com.phteam.consultoria.api.features.objetivo.model.Objetivo;

@Component
public class ObjetivoMapper {

    public Objetivo toEntity(ObjetivoRequestDTO dto) {
        Objetivo objetivo = new Objetivo();
        objetivo.setTipo(dto.tipo());
        objetivo.setDescricao(dto.descricao());
        objetivo.setDetalhes(dto.detalhes());
        objetivo.setAtivo(true);
        return objetivo;
    }

    public ObjetivoResponseDTO toResponseDTO(Objetivo objetivo) {
        return new ObjetivoResponseDTO(
                objetivo.getId(),
                objetivo.getTipo(),
                objetivo.getDescricao(),
                objetivo.getDetalhes(),
                objetivo.getAtivo()
        );
    }

    public void updateEntityFromDTO(ObjetivoUpdateDTO dto, Objetivo objetivo) {
        if (dto.tipo() != null) objetivo.setTipo(dto.tipo());
        if (dto.descricao() != null) objetivo.setDescricao(dto.descricao());
        if (dto.detalhes() != null) objetivo.setDetalhes(dto.detalhes());
        if (dto.ativo() != null) objetivo.setAtivo(dto.ativo());
    }
}
