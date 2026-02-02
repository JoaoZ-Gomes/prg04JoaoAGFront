package br.com.phteam.consultoria.api.features.consultor.model;

import br.com.phteam.consultoria.api.features.model.Usuario; // Classe base
import br.com.phteam.consultoria.api.features.cliente.model.Cliente; // Para o relacionamento com Cliente
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa o Consultor/Personal Trainer.
 * Herda dados de autenticação de Usuario.
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consultores")
public class Consultor extends Usuario {

    @Column(name = "numero_cref", nullable = false, unique = true, length = 15)
    private String numeroCref;

    @Column(name = "especializacao", length = 50)
    private String especializacao;

    @OneToMany(mappedBy = "consultor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cliente> clientes = new ArrayList<>();

    public void adicionarCliente(Cliente cliente) {
        clientes.add(cliente);
        cliente.setConsultor(this);
    }

    public void removerCliente(Cliente cliente) {
        clientes.remove(cliente);
        cliente.setConsultor(null);
    }
}
