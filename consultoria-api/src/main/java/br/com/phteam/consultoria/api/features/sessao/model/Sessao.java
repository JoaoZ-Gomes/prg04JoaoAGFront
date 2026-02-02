package br.com.phteam.consultoria.api.features.sessao.model;

import java.time.LocalDate;

import br.com.phteam.consultoria.api.features.rotina.model.Rotina;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sessoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rotina_id")
    private Rotina rotina;

    @Column(name = "data_sessao")
    private LocalDate dataSessao;

    @Column(length = 500)
    private String observacoes;

    @Column(length = 50)
    private String status;
}
