package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);

    // Busca usuários vinculados a um plano específico
    List<Usuario> findByPlanoId(Integer idPlano);

    // Verifica se email já existe (para validação no cadastro)
    boolean existsByEmail(String email);
}
