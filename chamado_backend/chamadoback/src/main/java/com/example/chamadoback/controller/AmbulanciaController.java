package com.example.chamadoback.controller;

import com.example.chamadoback.dto.AmbulanciaDTO;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.TipoEnum;
import com.example.chamadoback.service.AmbulanciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ambulancias")
public class AmbulanciaController {

    private final AmbulanciaService ambulanciaService;

    public AmbulanciaController(AmbulanciaService ambulanciaService) {
        this.ambulanciaService = ambulanciaService;
    }

    @GetMapping
    public ResponseEntity<List<AmbulanciaDTO>> listar() {
        return ResponseEntity.ok(ambulanciaService.listarTodasDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmbulanciaDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(ambulanciaService.buscarPorIdDTO(id));
    }

    @GetMapping("/empresa")
    public ResponseEntity<List<AmbulanciaDTO>> listarPorEmpresa(@RequestParam String cnpj) {
        return ResponseEntity.ok(ambulanciaService.listarPorEmpresaDTO(cnpj));
    }

    @GetMapping("/empresa/disponiveis")
    public ResponseEntity<List<AmbulanciaDTO>> listarDisponiveis(@RequestParam String cnpj) {
        return ResponseEntity.ok(ambulanciaService.listarDisponiveisPorEmpresaDTO(cnpj));
    }
    

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<AmbulanciaDTO>> listarPorTipo(@PathVariable TipoEnum tipo) {
        return ResponseEntity.ok(ambulanciaService.listarPorTipoDTO(tipo));
    }

    @PostMapping
    public ResponseEntity<AmbulanciaDTO> criar(@Valid @RequestBody AmbulanciaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ambulanciaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmbulanciaDTO> editar(@PathVariable Integer id, @Valid @RequestBody AmbulanciaDTO dto) {
        return ResponseEntity.ok(ambulanciaService.editar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        ambulanciaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AmbulanciaDTO> atualizarStatus(@PathVariable Integer id, @RequestParam StatusAmbulanciaEnum status) {
        return ResponseEntity.ok(ambulanciaService.atualizarStatus(id, status));
    }
}
