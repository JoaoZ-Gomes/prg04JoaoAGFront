package br.com.phteam.consultoria.api.features.cliente.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente;

/**
 * Repository da entidade Cliente.
 * Responsável apenas por acesso a dados — nenhuma regra de negócio aqui.
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);
}
