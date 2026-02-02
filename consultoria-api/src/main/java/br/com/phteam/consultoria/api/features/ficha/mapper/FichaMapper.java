package br.com.phteam.consultoria.api.features.ficha.mapper;

import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.response.FichaResponseDTO;
import br.com.phteam.consultoria.api.features.ficha.model.Ficha;
import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class FichaMapper {

    public Ficha toEntity(FichaCriarRequestDTO dto, Cliente cliente) {
        Ficha f = new Ficha();
        f.setNome(dto.nome());
        f.setObjetivo(dto.objetivo());
        f.setDataCriacao(LocalDate.now());
        f.setCliente(cliente);
        return f;
    }

    public FichaResponseDTO toResponse(Ficha f) {
        return new FichaResponseDTO(
                f.getId(),
                f.getNome(),
                f.getObjetivo(),
                f.getCliente() != null ? f.getCliente().getId() : null
        );
    }
}
