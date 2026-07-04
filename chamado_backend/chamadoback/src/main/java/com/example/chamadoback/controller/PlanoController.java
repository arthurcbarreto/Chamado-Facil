package com.example.chamadoback.controller;

import com.example.chamadoback.dto.PlanoDTO;
import com.example.chamadoback.service.PlanoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/planos")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @GetMapping
    public ResponseEntity<List<PlanoDTO>> listar() {
        return ResponseEntity.ok(planoService.listarTodosDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(planoService.buscarPorIdDTO(id));
    }

    @PostMapping
    public ResponseEntity<PlanoDTO> criar(@Valid @RequestBody PlanoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoDTO> editar(@PathVariable Integer id, @Valid @RequestBody PlanoDTO dto) {
        return ResponseEntity.ok(planoService.editar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        planoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
