package com.example.chamadoback.service;

import com.example.chamadoback.dto.EnderecoDTO;
import com.example.chamadoback.entity.Endereco;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.EnderecoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public EnderecoService(EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    public List<Endereco> listarTodos() {
        return enderecoRepository.findAll();
    }

    public Endereco buscarPorId(Integer id) {
        return enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço", id));
    }

    @Transactional
    public Endereco criar(EnderecoDTO dto) {
        Endereco endereco = toEntity(dto);
        if (!endereco.validar()) {
            throw new BusinessException("Endereço com campos obrigatórios inválidos ou incompletos.");
        }
        return enderecoRepository.save(endereco);
    }

    @Transactional
    public Endereco editar(Integer id, EnderecoDTO dto) {
        Endereco endereco = buscarPorId(id);
        endereco.setLogradouro(dto.getLogradouro());
        endereco.setNumero(dto.getNumero());
        endereco.setBairro(dto.getBairro());
        endereco.setCidade(dto.getCidade());
        endereco.setEstado(dto.getEstado());
        endereco.setCep(dto.getCep());
        return enderecoRepository.save(endereco);
    }

    @Transactional
    public void deletar(Integer id) {
        if (!enderecoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Endereço", id);
        }
        enderecoRepository.deleteById(id);
    }

    // ── Conversões ────────────────────────────────────────────
    public Endereco toEntity(EnderecoDTO dto) {
        Endereco e = new Endereco();
        e.setLogradouro(dto.getLogradouro());
        e.setNumero(dto.getNumero());
        e.setBairro(dto.getBairro());
        e.setCidade(dto.getCidade());
        e.setEstado(dto.getEstado());
        e.setCep(dto.getCep());
        return e;
    }

    public EnderecoDTO toDTO(Endereco e) {
        return new EnderecoDTO(
                e.getId(), e.getLogradouro(), e.getNumero(),
                e.getBairro(), e.getCidade(), e.getEstado(),
                e.getCep()
        );
    }
}
