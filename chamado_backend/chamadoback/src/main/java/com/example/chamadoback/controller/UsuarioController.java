package com.example.chamadoback.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chamadoback.dto.ChamadoDTO;
import com.example.chamadoback.dto.UsuarioDTO;
import com.example.chamadoback.service.ChamadoService;
import com.example.chamadoback.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ChamadoService chamadoService;

    public UsuarioController(UsuarioService usuarioService, ChamadoService chamadoService) {
        this.usuarioService = usuarioService;
        this.chamadoService = chamadoService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodosDTO());
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<UsuarioDTO> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(usuarioService.buscarPorCpfDTO(cpf));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@Validated(UsuarioDTO.Cadastro.class) @RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(dto));
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<UsuarioDTO> editar(@PathVariable String cpf, @Validated(UsuarioDTO.Edicao.class) @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.editar(cpf, dto));
    }

    @PatchMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(
        @RequestParam String cpf,
        @RequestParam String email,
        @RequestParam String novaSenha) {
    usuarioService.recuperarSenha(cpf, email, novaSenha);
    return ResponseEntity.noContent().build();
}

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletar(@PathVariable String cpf) {
        usuarioService.deletar(cpf);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestParam String email, @RequestParam String senha) {
        return usuarioService.login(email, senha)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{cpf}/chamados")
    public ResponseEntity<List<ChamadoDTO>> listarChamados(@PathVariable String cpf) {
        return ResponseEntity.ok(chamadoService.listarPorUsuarioDTO(cpf));
    }

    @GetMapping("/{cpf}/chamados/filtrar")
    public ResponseEntity<List<ChamadoDTO>> filtrarChamados(
            @PathVariable String cpf,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(chamadoService.filtrarPorDataDTO(cpf, inicio, fim));
    }
}
