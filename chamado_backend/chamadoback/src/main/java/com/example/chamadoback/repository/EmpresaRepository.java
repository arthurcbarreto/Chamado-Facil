package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, String> {

    Optional<Empresa> findByCnpj(String cnpj);

    Optional<Empresa> findByNome(String nome);
}
