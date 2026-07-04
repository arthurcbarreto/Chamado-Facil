package com.example.chamadoback.controller;

import com.example.chamadoback.entity.Endereco;
import com.example.chamadoback.repository.EnderecoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

    private final EnderecoRepository enderecoRepository;

    public EnderecoController(EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Endereco>> listar() {
        return ResponseEntity.ok(enderecoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarPorId(@PathVariable Integer id) {
        return enderecoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Endereco> criar(@RequestBody Endereco endereco) {
        if (!endereco.validar()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enderecoRepository.save(endereco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Endereco> editar(@PathVariable Integer id,
                                            @RequestBody Endereco dados) {
        return enderecoRepository.findById(id).map(e -> {
            e.setLogradouro(dados.getLogradouro());
            e.setNumero(dados.getNumero());
            e.setBairro(dados.getBairro());
            e.setCidade(dados.getCidade());
            e.setEstado(dados.getEstado());
            e.setCep(dados.getCep());
            return ResponseEntity.ok(enderecoRepository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!enderecoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        enderecoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
