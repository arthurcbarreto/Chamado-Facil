package com.example.chamadoback.controller;

import com.example.chamadoback.entity.Empresa;
import com.example.chamadoback.repository.EmpresaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    public EmpresaController(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> listar() {
        return ResponseEntity.ok(empresaRepository.findAll());
    }

    @GetMapping("/{cnpj}")
    public ResponseEntity<Empresa> buscarPorCnpj(@PathVariable String cnpj) {
        return empresaRepository.findByCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Empresa> criar(@RequestBody Empresa empresa) {
        if (empresaRepository.existsById(empresa.getCnpj())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(empresaRepository.save(empresa));
    }

    // RF08 — editar dados da empresa (UC06)
    @PutMapping("/{cnpj}")
    public ResponseEntity<Empresa> editar(@PathVariable String cnpj,
                                           @RequestBody Empresa dados) {
        return empresaRepository.findByCnpj(cnpj).map(e -> {
            e.setNome(dados.getNome());
            e.setTelefone(dados.getTelefone());
            e.setEndereco(dados.getEndereco());
            return ResponseEntity.ok(empresaRepository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cnpj}")
    public ResponseEntity<Void> deletar(@PathVariable String cnpj) {
        if (!empresaRepository.existsById(cnpj)) {
            return ResponseEntity.notFound().build();
        }
        empresaRepository.deleteById(cnpj);
        return ResponseEntity.noContent().build();
    }
}
