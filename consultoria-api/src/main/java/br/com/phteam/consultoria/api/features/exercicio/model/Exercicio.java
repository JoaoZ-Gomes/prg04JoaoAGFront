package br.com.phteam.consultoria.api.features.exercicio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercicios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(name = "grupo_muscular", nullable = false, length = 50)
    private String grupoMuscular;

    @Column(length = 50)
    private String equipamento;

    @Column(name = "url_video", length = 255)
    private String urlVideo;

    @Column(length = 500)
    private String descricao;
}
