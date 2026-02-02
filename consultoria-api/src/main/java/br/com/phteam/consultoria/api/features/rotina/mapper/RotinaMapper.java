package br.com.phteam.consultoria.api.features.rotina.mapper;

import br.com.phteam.consultoria.api.features.rotina.dto.request.RotinaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.rotina.dto.response.RotinaResponseDTO;
import br.com.phteam.consultoria.api.features.rotina.model.Rotina;
import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;
import br.com.phteam.consultoria.api.features.ficha.model.Ficha;
import org.springframework.stereotype.Component;

@Component
public class RotinaMapper {

    public Rotina toEntity(RotinaCriarRequestDTO dto, Ficha ficha, Exercicio exercicio) {
        Rotina r = new Rotina();
        r.setNome(dto.nome());
        r.setFicha(ficha);
        r.setExercicio(exercicio);
        r.setSeries(dto.series());
        r.setRepeticoes(dto.repeticoes());
        return r;
    }

    public RotinaResponseDTO toResponse(Rotina r) {
        return new RotinaResponseDTO(
                r.getId(),
                r.getNome(),
                r.getFicha() != null ? r.getFicha().getId() : null,
                r.getExercicio() != null ? r.getExercicio().getId() : null,
                r.getSeries(),
                r.getRepeticoes()
        );
    }
}
