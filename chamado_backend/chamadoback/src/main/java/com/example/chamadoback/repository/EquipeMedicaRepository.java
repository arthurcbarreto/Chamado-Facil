package com.example.chamadoback.repository;

import com.example.chamadoback.entity.EquipeMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipeMedicaRepository extends JpaRepository<EquipeMedica, Integer> {

    // Busca equipe vinculada a uma ambulância
    Optional<EquipeMedica> findByAmbulanciaId(Integer idAmbulancia);

    // Busca equipes sem ambulância vinculada (disponíveis)
    List<EquipeMedica> findByAmbulanciaIsNull();

    List<EquipeMedica> findByEspecialidadeIgnoreCase(String especialidade);
}
