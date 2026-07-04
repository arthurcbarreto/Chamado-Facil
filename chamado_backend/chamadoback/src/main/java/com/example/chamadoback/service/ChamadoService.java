package com.example.chamadoback.service;

import com.example.chamadoback.dto.ChamadoDTO;
import com.example.chamadoback.entity.Ambulancia;
import com.example.chamadoback.entity.Chamado;
import com.example.chamadoback.entity.Endereco;
import com.example.chamadoback.entity.Usuario;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.StatusChamadoEnum;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.ChamadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final UsuarioService    usuarioService;
    private final AmbulanciaService ambulanciaService;
    private final EnderecoService   enderecoService;

    public ChamadoService(ChamadoRepository chamadoRepository, UsuarioService usuarioService,
                           AmbulanciaService ambulanciaService, EnderecoService enderecoService) {
        this.chamadoRepository  = chamadoRepository;
        this.usuarioService     = usuarioService;
        this.ambulanciaService  = ambulanciaService;
        this.enderecoService    = enderecoService;
    }

    // ── Leitura — conversão ocorre dentro da transação ────────

    @Transactional(readOnly = true)
    public List<ChamadoDTO> listarTodosDTO() {
        return chamadoRepository.findAll().stream()
                .map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChamadoDTO buscarPorIdDTO(Integer id) {
        return toDTOInternal(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<ChamadoDTO> listarPorUsuarioDTO(String cpf) {
        usuarioService.buscarPorCpf(cpf);
        return chamadoRepository.findByUsuarioCpf(cpf).stream()
                .map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChamadoDTO> filtrarPorDataDTO(String cpf, LocalDateTime inicio, LocalDateTime fim) {
        usuarioService.buscarPorCpf(cpf);
        return chamadoRepository.findByUsuarioCpfAndDataHoraPedidoBetween(cpf, inicio, fim).stream()
                .map(this::toDTOInternal).collect(Collectors.toList());
    }

    // Usado internamente (ex: buscar entity para consultarStatus)
    @Transactional(readOnly = true)
    public Chamado buscarPorId(Integer id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado", id));
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarPorUsuario(String cpf) {
        usuarioService.buscarPorCpf(cpf);
        return chamadoRepository.findByUsuarioCpf(cpf);
    }

    @Transactional(readOnly = true)
    public List<Chamado> filtrarPorData(String cpf, LocalDateTime inicio, LocalDateTime fim) {
        usuarioService.buscarPorCpf(cpf);
        return chamadoRepository.findByUsuarioCpfAndDataHoraPedidoBetween(cpf, inicio, fim);
    }

    // ── Escrita ───────────────────────────────────────────────

    @Transactional
    public ChamadoDTO abrir(ChamadoDTO dto) {
        Usuario usuario = usuarioService.buscarPorCpf(dto.getCpfUsuario());
        if (usuario.getPlano() == null) {
            throw new BusinessException("O usuário não possui um plano ativo. Contate o administrador.");
        }
        Endereco endereco = enderecoService.criar(dto.getEndereco());
        Chamado chamado = new Chamado(dto.getSintomas(), dto.getGravidade(), usuario, endereco);
        chamado.registrar();
        chamado.setAmbulancias(new ArrayList<>());
        return toDTOInternal(chamadoRepository.save(chamado));
    }

    @Transactional
    public ChamadoDTO atribuirAmbulanciaDTO(Integer idChamado, Integer idAmbulancia) {
        Chamado    chamado    = buscarPorId(idChamado);
        Ambulancia ambulancia = ambulanciaService.buscarPorId(idAmbulancia);
        if (chamado.getStatus() == StatusChamadoEnum.CONCLUIDO ||
            chamado.getStatus() == StatusChamadoEnum.CANCELADO) {
            throw new BusinessException("Não é possível atribuir ambulância a um chamado " +
                                        chamado.getStatus().name().toLowerCase() + ".");
        }

        // Valida compatibilidade entre plano do usuário e tipo da ambulância
        String nomePlano = chamado.getUsuario().getPlano() != null
                ? chamado.getUsuario().getPlano().getNome().toUpperCase() : "";
        String tipoAmb = ambulancia.getTipo().name();

        if (nomePlano.contains("UTI") && tipoAmb.equals("SIMPLES")) {
            throw new BusinessException(
                "O plano do usuário é UTI. Apenas ambulâncias UTI podem ser atribuídas a este chamado.");
        }
        if ((nomePlano.contains("SIMPLES") || nomePlano.contains("SIMPLE")) && tipoAmb.equals("UTI")) {
            throw new BusinessException(
                "O plano do usuário é Simples. Apenas ambulâncias Simples podem ser atribuídas a este chamado.");
        }

        chamado.atribuirAmbulancia(ambulancia);
        ambulanciaService.atualizarStatusEntity(idAmbulancia, StatusAmbulanciaEnum.EM_DESLOCAMENTO);
        return toDTOInternal(chamadoRepository.save(chamado));
    }

        @Transactional
        public ChamadoDTO concluirDTO(Integer id) {
            Chamado chamado = buscarPorId(id);
            if (chamado.getStatus() != StatusChamadoEnum.EM_ATENDIMENTO) {
                throw new BusinessException("Somente chamados em atendimento podem ser concluídos.");
            }
            chamado.concluir();
            chamado.getAmbulancias().forEach(a ->
                ambulanciaService.atualizarStatusEntity(a.getId(), StatusAmbulanciaEnum.DISPONIVEL));
            return toDTOInternal(chamadoRepository.save(chamado));
        }

    @Transactional
    public ChamadoDTO cancelarDTO(Integer id) {
        Chamado chamado = buscarPorId(id);
        if (chamado.getStatus() == StatusChamadoEnum.CONCLUIDO) {
            throw new BusinessException("Chamados concluídos não podem ser cancelados.");
        }
        chamado.setStatus(StatusChamadoEnum.CANCELADO);
        if (chamado.getAmbulancias() != null) {
            chamado.getAmbulancias().forEach(a ->
                ambulanciaService.atualizarStatusEntity(a.getId(), StatusAmbulanciaEnum.DISPONIVEL));
        }
        return toDTOInternal(chamadoRepository.save(chamado));
    }

    // ── Conversão interna — chamada DENTRO de transação ──────

    ChamadoDTO toDTOInternal(Chamado c) {
        ChamadoDTO dto = new ChamadoDTO();
        dto.setId(c.getId());
        dto.setSintomas(c.getSintomas());
        dto.setGravidade(c.getGravidade());
        dto.setStatus(c.getStatus());
        dto.setDataHoraPedido(c.getDataHoraPedido());
        dto.setDataHoraAtendimento(c.getDataHoraAtendimento());
        dto.setDataHoraConclusao(c.getDataHoraConclusao());
        dto.setCpfUsuario(c.getUsuario().getCpf());
        dto.setNomeUsuario(c.getUsuario().getNome());
        dto.setEndereco(enderecoService.toDTO(c.getEndereco()));
        if (c.getAmbulancias() != null) {
            dto.setAmbulancias(c.getAmbulancias().stream()
                .map(a -> new ChamadoDTO.AmbulanciaResumoDTO(a.getId(), a.getPlaca(), a.getTipo().name()))
                .collect(Collectors.toList()));
        }
        return dto;
    }

    // Mantido para compatibilidade com UsuarioController
    @Transactional(readOnly = true)
    public ChamadoDTO toDTO(Chamado c) {
        return toDTOInternal(c);
    }
}
