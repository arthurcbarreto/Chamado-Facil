package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByEmail(String email);

    // Busca todos os admins de uma empresa
    List<Administrador> findByEmpresaCnpj(String cnpj);

    boolean existsByEmail(String email);
}
