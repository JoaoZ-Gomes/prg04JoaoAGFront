package br.com.phteam.consultoria.api.features.objetivo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.phteam.consultoria.api.features.objetivo.model.Objetivo;
import br.com.phteam.consultoria.api.features.objetivo.model.TipoObjetivo;

@Repository
public interface ObjetivoRepository extends JpaRepository<Objetivo, Long> {
    List<Objetivo> findByAtivoTrue();
    Objetivo findByTipo(TipoObjetivo tipo);
}
