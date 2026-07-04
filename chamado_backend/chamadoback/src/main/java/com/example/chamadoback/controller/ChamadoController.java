package com.example.chamadoback.controller;

import com.example.chamadoback.dto.ChamadoDTO;
import com.example.chamadoback.enums.StatusChamadoEnum;
import com.example.chamadoback.service.ChamadoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    private final ChamadoService chamadoService;

    public ChamadoController(ChamadoService chamadoService) {
        this.chamadoService = chamadoService;
    }

    @GetMapping
    public ResponseEntity<List<ChamadoDTO>> listar() {
        return ResponseEntity.ok(chamadoService.listarTodosDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChamadoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(chamadoService.buscarPorIdDTO(id));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<StatusChamadoEnum> consultarStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(chamadoService.buscarPorId(id).consultarStatus());
    }

    @PostMapping
    public ResponseEntity<ChamadoDTO> abrir(@Valid @RequestBody ChamadoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chamadoService.abrir(dto));
    }

    @PatchMapping("/{idChamado}/ambulancia/{idAmbulancia}")
    public ResponseEntity<ChamadoDTO> atribuirAmbulancia(@PathVariable Integer idChamado,
                                                          @PathVariable Integer idAmbulancia) {
        return ResponseEntity.ok(chamadoService.atribuirAmbulanciaDTO(idChamado, idAmbulancia));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ChamadoDTO> concluir(@PathVariable Integer id) {
        return ResponseEntity.ok(chamadoService.concluirDTO(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ChamadoDTO> cancelar(@PathVariable Integer id) {
        return ResponseEntity.ok(chamadoService.cancelarDTO(id));
    }
}
