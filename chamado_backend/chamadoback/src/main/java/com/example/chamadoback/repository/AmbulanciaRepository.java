package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Ambulancia;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.TipoEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Integer> {

    Optional<Ambulancia> findByPlaca(String placa);

    // Busca todas as ambulâncias de uma empresa
    List<Ambulancia> findByEmpresaCnpj(String cnpj);

    // Busca ambulâncias disponíveis de uma empresa (RN09)
    List<Ambulancia> findByEmpresaCnpjAndStatus(String cnpj, StatusAmbulanciaEnum status);

    // Busca por tipo (UTI ou Simples)
    List<Ambulancia> findByTipo(TipoEnum tipo);
}
