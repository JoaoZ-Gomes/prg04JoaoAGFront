package br.com.phteam.consultoria.api.features.consultor.repository;

import br.com.phteam.consultoria.api.features.consultor.model.Consultor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultorRepository extends JpaRepository<Consultor, Long> {


    Optional<Consultor> findByNumeroCref(String numeroCref);


    Optional<Consultor> findByEmail(String email);


    List<Consultor> findByEspecializacaoIgnoreCase(String especializacao);


    List<Consultor> findByEspecializacaoContainingIgnoreCase(String termo);
}
