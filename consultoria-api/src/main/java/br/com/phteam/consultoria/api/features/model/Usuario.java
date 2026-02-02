package br.com.phteam.consultoria.api.features.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Classe base abstrata que contém atributos comuns para autenticação e dados de contato.
 * @MappedSuperclass garante que seus campos sejam herdados pelas subclasses,
 * mas ela mesma não será mapeada para uma tabela no banco de dados.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(length = 20)
    private String telefone;


}