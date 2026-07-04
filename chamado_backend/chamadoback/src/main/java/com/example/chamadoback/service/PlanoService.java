package com.example.chamadoback.service;

import com.example.chamadoback.dto.PlanoDTO;
import com.example.chamadoback.entity.Empresa;
import com.example.chamadoback.entity.Plano;
import com.example.chamadoback.entity.Usuario;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.PlanoRepository;
import com.example.chamadoback.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlanoService {

    private final PlanoRepository   planoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaService    empresaService;

    public PlanoService(PlanoRepository planoRepository, UsuarioRepository usuarioRepository, EmpresaService empresaService) {
        this.planoRepository   = planoRepository;
        this.usuarioRepository = usuarioRepository;
        this.empresaService    = empresaService;
    }

    @Transactional(readOnly = true)
    public Plano buscarPorId(Integer id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano", id));
    }

    @Transactional(readOnly = true)
    public List<PlanoDTO> listarTodosDTO() {
        return planoRepository.findAll().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlanoDTO> listarPorEmpresaDTO(String cnpj) {
        return planoRepository.findByEmpresaCnpj(cnpj).stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanoDTO buscarPorIdDTO(Integer id) {
        return toDTOInternal(buscarPorId(id));
    }

    @Transactional
    public PlanoDTO criar(PlanoDTO dto) {
        Empresa empresa = empresaService.buscarPorCnpj(dto.getCnpjEmpresa());
        return toDTOInternal(planoRepository.save(new Plano(dto.getNome(), dto.getDescricao(), empresa)));
    }

    @Transactional
    public PlanoDTO editar(Integer id, PlanoDTO dto) {
        Plano plano = buscarPorId(id);
        plano.setNome(dto.getNome());
        plano.setDescricao(dto.getDescricao());
        return toDTOInternal(planoRepository.save(plano));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!planoRepository.existsById(id)) throw new ResourceNotFoundException("Plano", id);
        planoRepository.deleteById(id);
    }

    @Transactional
    public void vincularUsuario(Integer idPlano, String cpf) {
        Plano plano = buscarPorId(idPlano);
        Usuario usuario = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", cpf));
        plano.vincularUsuario(usuario);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void desvincularUsuario(Integer idPlano, String cpf) {
        Plano plano = buscarPorId(idPlano);
        Usuario usuario = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", cpf));
        plano.desvincularUsuario(usuario);
        usuarioRepository.save(usuario);
    }

    PlanoDTO toDTOInternal(Plano p) {
        return new PlanoDTO(p.getId(), p.getNome(), p.getDescricao(),
                p.getEmpresa() != null ? p.getEmpresa().getCnpj() : null);
    }
}
