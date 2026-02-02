package br.com.phteam.consultoria.api.features.exercicio.mapper;

import br.com.phteam.consultoria.api.features.exercicio.dto.request.ExercicioCriarRequestDTO;
import br.com.phteam.consultoria.api.features.exercicio.dto.response.ExercicioResponseDTO;
import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;
import org.springframework.stereotype.Component;

@Component
public class ExercicioMapper {

    public Exercicio toEntity(ExercicioCriarRequestDTO dto) {
        Exercicio e = new Exercicio();
        e.setNome(dto.nome());
        e.setGrupoMuscular(dto.grupoMuscular());
        e.setEquipamento(dto.equipamento());
        e.setUrlVideo(dto.urlVideo());
        e.setDescricao(dto.descricao());
        return e;
    }

    public ExercicioResponseDTO toResponse(Exercicio e) {
        return new ExercicioResponseDTO(
                e.getId(),
                e.getNome(),
                e.getGrupoMuscular(),
                e.getEquipamento(),
                e.getUrlVideo(),
                e.getDescricao()
        );
    }
}
