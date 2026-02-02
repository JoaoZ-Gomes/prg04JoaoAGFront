package br.com.phteam.consultoria.api.features.model;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente; // Relacionamento com Cliente
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidade que registra o progresso e as métricas do Cliente em um determinado momento.
 */
@Entity
@Table(name = "avaliacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "data_avaliacao")
    private LocalDateTime dataAvaliacao = LocalDateTime.now();

    private double peso; // Peso registrado na avaliação

    private double percentualGordura; // % de gordura

    @Column(length = 200)
    private String observacoes;

    // Relacionamento: Muitas Avaliações pertencem a Um Cliente (Many-to-One)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Nota: Campos para URLs de fotos de progresso (antes/depois) podem ser adicionados.
}