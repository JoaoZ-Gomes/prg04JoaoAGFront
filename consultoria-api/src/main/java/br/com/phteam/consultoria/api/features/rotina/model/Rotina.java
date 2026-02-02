package br.com.phteam.consultoria.api.features.rotina.model;

import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;
import br.com.phteam.consultoria.api.features.ficha.model.Ficha;
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
@Table(name = "rotinas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rotina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "ficha_id")
    private Ficha ficha;

    @ManyToOne
    @JoinColumn(name = "exercicio_id")
    private Exercicio exercicio;

    @Column(name = "repeticoes")
    private Integer repeticoes;

    @Column(name = "series")
    private Integer series;
}
