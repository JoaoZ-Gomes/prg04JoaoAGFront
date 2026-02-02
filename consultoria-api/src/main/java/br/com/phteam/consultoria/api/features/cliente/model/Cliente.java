package br.com.phteam.consultoria.api.features.cliente.model;

import java.time.LocalDate;

import br.com.phteam.consultoria.api.features.consultor.model.Consultor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    private String rg;

    private LocalDate dataNascimento;

    private String telefone;

    private Double pesoAtual;

    private Double altura;

    @ManyToOne
    @JoinColumn(name = "consultor_id")
    private Consultor consultor;
}
