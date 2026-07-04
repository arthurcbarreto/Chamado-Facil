package com.example.chamadoback.service;

import com.example.chamadoback.dto.EmpresaDTO;
import com.example.chamadoback.entity.Empresa;
import com.example.chamadoback.entity.Endereco;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final EnderecoService   enderecoService;

    public EmpresaService(EmpresaRepository empresaRepository,
                          EnderecoService enderecoService) {
        this.empresaRepository = empresaRepository;
        this.enderecoService   = enderecoService;
    }

    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }

    public Empresa buscarPorCnpj(String cnpj) {
        return empresaRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa", cnpj));
    }

    @Transactional
    public Empresa criar(EmpresaDTO dto) {
        // RN10 — CNPJ deve ser único
        if (empresaRepository.existsById(dto.getCnpj())) {
            throw new BusinessException("cnpj", "Já existe uma empresa cadastrada com este CNPJ.");
        }
        Endereco endereco = enderecoService.criar(dto.getEndereco());
        Empresa empresa = new Empresa(dto.getCnpj(), dto.getNome(),
                                      dto.getTelefone(), endereco);
        return empresaRepository.save(empresa);
    }

    @Transactional
    public Empresa editar(String cnpj, EmpresaDTO dto) {
        Empresa empresa = buscarPorCnpj(cnpj);
        empresa.setNome(dto.getNome());
        empresa.setTelefone(dto.getTelefone());
        if (dto.getEndereco() != null) {
            enderecoService.editar(empresa.getEndereco().getId(), dto.getEndereco());
        }
        return empresaRepository.save(empresa);
    }

    @Transactional
    public void deletar(String cnpj) {
        if (!empresaRepository.existsById(cnpj)) {
            throw new ResourceNotFoundException("Empresa", cnpj);
        }
        empresaRepository.deleteById(cnpj);
    }

    // ── Conversões ────────────────────────────────────────────
    public EmpresaDTO toDTO(Empresa e) {
        return new EmpresaDTO(
                e.getCnpj(),
                e.getNome(),
                e.getTelefone(),
                e.getEndereco() != null ? enderecoService.toDTO(e.getEndereco()) : null
        );
    }
}
