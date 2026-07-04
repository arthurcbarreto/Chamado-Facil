package com.example.chamadoback.controller;

import com.example.chamadoback.dto.AdministradorDTO;
import com.example.chamadoback.service.AdministradorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/administradores")
public class AdministradorController {

    private final AdministradorService administradorService;

    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @GetMapping
    public ResponseEntity<List<AdministradorDTO>> listar() {
        return ResponseEntity.ok(administradorService.listarTodosDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministradorDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(administradorService.buscarPorIdDTO(id));
    }

    @PostMapping
    public ResponseEntity<AdministradorDTO> criar(@Valid @RequestBody AdministradorDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(administradorService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministradorDTO> editar(@PathVariable Integer id, @Valid @RequestBody AdministradorDTO dto) {
        return ResponseEntity.ok(administradorService.editar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        administradorService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestParam String email, @RequestParam String senha) {
        boolean ok = administradorService.login(email, senha);
        return ok ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/{idAdmin}/planos/{idPlano}/usuarios/{cpf}")
    public ResponseEntity<Void> vincularUsuarioAoPlano(@PathVariable Integer idAdmin,
                                                        @PathVariable Integer idPlano,
                                                        @PathVariable String cpf) {
        administradorService.vincularUsuarioAoPlano(idAdmin, idPlano, cpf);
        return ResponseEntity.noContent().build();
    }
}
