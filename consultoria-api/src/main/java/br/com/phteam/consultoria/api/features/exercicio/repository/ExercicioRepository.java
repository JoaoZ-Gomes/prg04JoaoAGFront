package br.com.phteam.consultoria.api.features.exercicio.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.phteam.consultoria.api.features.exercicio.model.Exercicio;

@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    List<Exercicio> findAllByGrupoMuscularIgnoreCase(String grupoMuscular);

    Optional<Exercicio> findByNome(String nome);
}
