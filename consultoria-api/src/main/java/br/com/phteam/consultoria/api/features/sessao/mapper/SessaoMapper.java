package br.com.phteam.consultoria.api.features.sessao.mapper;

import br.com.phteam.consultoria.api.features.sessao.dto.request.SessaoCriarRequestDTO;
import br.com.phteam.consultoria.api.features.sessao.dto.response.SessaoResponseDTO;
import br.com.phteam.consultoria.api.features.sessao.model.Sessao;
import br.com.phteam.consultoria.api.features.rotina.model.Rotina;
import org.springframework.stereotype.Component;

@Component
public class SessaoMapper {

    public Sessao toEntity(SessaoCriarRequestDTO dto, Rotina rotina) {
        Sessao s = new Sessao();
        s.setRotina(rotina);
        s.setDataSessao(dto.dataSessao());
        s.setObservacoes(dto.observacoes());
        s.setStatus(dto.status());
        return s;
    }

    public SessaoResponseDTO toResponse(Sessao s) {
        return new SessaoResponseDTO(
                s.getId(),
                s.getRotina() != null ? s.getRotina().getId() : null,
                s.getDataSessao(),
                s.getObservacoes(),
                s.getStatus()
        );
    }
}
