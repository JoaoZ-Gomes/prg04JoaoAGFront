package br.com.phteam.consultoria.api.features.rotina.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.phteam.consultoria.api.features.rotina.model.Rotina;

@Repository
public interface RotinaRepository extends JpaRepository<Rotina, Long> {
    List<Rotina> findByFichaId(Long fichaId);
}
