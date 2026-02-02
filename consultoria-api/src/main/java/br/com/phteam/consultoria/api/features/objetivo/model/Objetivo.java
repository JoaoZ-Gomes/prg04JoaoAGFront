package br.com.phteam.consultoria.api.features.objetivo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "objetivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Objetivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoObjetivo tipo;

    @Column(nullable = false)
    private String descricao;

    private String detalhes;

    @Column(nullable = false)
    private Boolean ativo = true;

    public Objetivo(TipoObjetivo tipo, String descricao) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.ativo = true;
    }
}
