package com.example.chamadoback.controller;

import com.example.chamadoback.dto.EquipeMedicaDTO;
import com.example.chamadoback.service.EquipeMedicaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/equipes")
public class EquipeMedicaController {

    private final EquipeMedicaService equipeMedicaService;

    public EquipeMedicaController(EquipeMedicaService equipeMedicaService) {
        this.equipeMedicaService = equipeMedicaService;
    }

    @GetMapping
    public ResponseEntity<List<EquipeMedicaDTO>> listar() {
        return ResponseEntity.ok(equipeMedicaService.listarTodasDTO());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<EquipeMedicaDTO>> listarDisponiveis() {
        return ResponseEntity.ok(equipeMedicaService.listarDisponiveisDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipeMedicaDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(equipeMedicaService.buscarPorIdDTO(id));
    }

    @PostMapping
    public ResponseEntity<EquipeMedicaDTO> criar(@Valid @RequestBody EquipeMedicaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipeMedicaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipeMedicaDTO> editar(@PathVariable Integer id, @Valid @RequestBody EquipeMedicaDTO dto) {
        return ResponseEntity.ok(equipeMedicaService.editar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        equipeMedicaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{idEquipe}/vincular/{idAmbulancia}")
    public ResponseEntity<Void> vincular(@PathVariable Integer idEquipe, @PathVariable Integer idAmbulancia) {
        equipeMedicaService.vincularAmbulancia(idEquipe, idAmbulancia);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{idEquipe}/desvincular")
    public ResponseEntity<Void> desvincular(@PathVariable Integer idEquipe) {
        equipeMedicaService.desvincularAmbulancia(idEquipe);
        return ResponseEntity.noContent().build();
    }
}
