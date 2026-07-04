package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {

    List<Endereco> findByCidade(String cidade);

    List<Endereco> findByEstado(String estado);

    List<Endereco> findByCep(String cep);
}
