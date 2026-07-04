package com.example.chamadoback.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chamadoback.dto.UsuarioDTO;
import com.example.chamadoback.entity.Plano;
import com.example.chamadoback.entity.Usuario;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PlanoService      planoService;
    private final PasswordEncoder   passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PlanoService planoService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.planoService      = planoService;
        this.passwordEncoder   = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorCpf(String cpf) {
        return usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", cpf));
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodosDTO() {
        return usuarioRepository.findAll().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorCpfDTO(String cpf) {
        return toDTOInternal(buscarPorCpf(cpf));
    }

    private String normalizarCpf(String cpf) {
        return cpf == null ? null : cpf.replaceAll("[^0-9]", "");
    }

    @Transactional
    public UsuarioDTO criar(UsuarioDTO dto) {
        dto.setCpf(normalizarCpf(dto.getCpf()));
        if (usuarioRepository.existsById(dto.getCpf()))
            throw new BusinessException("cpf", "Já existe um usuário cadastrado com este CPF.");
        if (usuarioRepository.existsByEmail(dto.getEmail()))
            throw new BusinessException("email", "E-mail já cadastrado.");
        Plano plano = planoService.buscarPorId(dto.getIdPlano());
        Usuario usuario = new Usuario(dto.getCpf(), dto.getNome(), dto.getEmail(),
                passwordEncoder.encode(dto.getSenha()), dto.getDataNascimento(), plano);
        return toDTOInternal(usuarioRepository.save(usuario));
    }

    public boolean login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Credenciais inválidas."));
        return passwordEncoder.matches(senha, usuario.getSenha());
    }

    @Transactional
    public UsuarioDTO editar(String cpf, UsuarioDTO dto) {
        Usuario usuario = buscarPorCpf(cpf);
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setDataNascimento(dto.getDataNascimento());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        return toDTOInternal(usuarioRepository.save(usuario));
    }

    @Transactional
    public void deletar(String cpf) {
        if (!usuarioRepository.existsById(cpf)) throw new ResourceNotFoundException("Usuário", cpf);
        usuarioRepository.deleteById(cpf);
    }

    @Transactional
    public void recuperarSenha(String cpf, String email, String novaSenha) {
        Usuario usuario = usuarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new BusinessException("CPF não encontrado."));
        if (!usuario.getEmail().equalsIgnoreCase(email)) {
            throw new BusinessException("E-mail não corresponde ao CPF informado.");
        }
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    UsuarioDTO toDTOInternal(Usuario u) {
        return new UsuarioDTO(u.getCpf(), u.getNome(), u.getEmail(), u.getDataNascimento(),
                u.getPlano() != null ? u.getPlano().getId()   : null,
                u.getPlano() != null ? u.getPlano().getNome() : null);
    }
}