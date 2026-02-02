package br.com.phteam.consultoria.api.features.ficha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.phteam.consultoria.api.features.ficha.model.Ficha;

@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {

    List<Ficha> findByClienteId(Long clienteId);
}
