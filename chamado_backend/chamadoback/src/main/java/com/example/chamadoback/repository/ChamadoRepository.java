package com.example.chamadoback.repository;

import com.example.chamadoback.entity.Chamado;
import com.example.chamadoback.enums.StatusChamadoEnum;
import com.example.chamadoback.enums.GravidadeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {

    // Histórico de chamados de um usuário (RF09)
    List<Chamado> findByUsuarioCpf(String cpf);

    // Filtrar histórico por data (UC03 + filtrar por data)
    List<Chamado> findByUsuarioCpfAndDataHoraPedidoBetween(
        String cpf,
        LocalDateTime inicio,
        LocalDateTime fim
    );

    // Busca chamados por status
    List<Chamado> findByStatus(StatusChamadoEnum status);

    // Busca chamados por gravidade
    List<Chamado> findByGravidade(GravidadeEnum gravidade);

    // Chamados em aberto de um usuário
    List<Chamado> findByUsuarioCpfAndStatus(String cpf, StatusChamadoEnum status);
}
