package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoRepository extends JpaRepository<Plano, Integer> {

    List<Plano> findByEmpresaCnpj(String cnpj);

    List<Plano> findByNomeContainingIgnoreCase(String nome);
}
