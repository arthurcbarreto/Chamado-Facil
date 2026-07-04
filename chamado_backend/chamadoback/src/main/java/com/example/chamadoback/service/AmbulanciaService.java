package com.example.chamadoback.service;

import com.example.chamadoback.dto.AmbulanciaDTO;
import com.example.chamadoback.entity.Ambulancia;
import com.example.chamadoback.entity.Empresa;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.TipoEnum;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.AmbulanciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanciaService {

    private final AmbulanciaRepository ambulanciaRepository;
    private final EmpresaService       empresaService;

    public AmbulanciaService(AmbulanciaRepository ambulanciaRepository, EmpresaService empresaService) {
        this.ambulanciaRepository = ambulanciaRepository;
        this.empresaService       = empresaService;
    }

    @Transactional(readOnly = true)
    public Ambulancia buscarPorId(Integer id) {
        return ambulanciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulância", id));
    }

    @Transactional(readOnly = true)
    public List<AmbulanciaDTO> listarTodasDTO() {
        return ambulanciaRepository.findAll().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AmbulanciaDTO buscarPorIdDTO(Integer id) {
        return toDTOInternal(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<AmbulanciaDTO> listarPorEmpresaDTO(String cnpj) {
        return ambulanciaRepository.findByEmpresaCnpj(cnpj).stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmbulanciaDTO> listarDisponiveisPorEmpresaDTO(String cnpj) {
        return ambulanciaRepository.findByEmpresaCnpjAndStatus(cnpj, StatusAmbulanciaEnum.DISPONIVEL)
                .stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmbulanciaDTO> listarPorTipoDTO(TipoEnum tipo) {
        return ambulanciaRepository.findByTipo(tipo).stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional
    public AmbulanciaDTO criar(AmbulanciaDTO dto) {
        if (ambulanciaRepository.findByPlaca(dto.getPlaca()).isPresent()) {
            throw new BusinessException("placa", "Já existe uma ambulância com esta placa.");
        }
        Empresa empresa = empresaService.buscarPorCnpj(dto.getCnpjEmpresa());
        Ambulancia ambulancia = new Ambulancia(dto.getPlaca(), dto.getTipo(), empresa);
        return toDTOInternal(ambulanciaRepository.save(ambulancia));
    }

    @Transactional
    public AmbulanciaDTO editar(Integer id, AmbulanciaDTO dto) {
        Ambulancia ambulancia = buscarPorId(id);
        ambulancia.setPlaca(dto.getPlaca());
        ambulancia.setTipo(dto.getTipo());
        return toDTOInternal(ambulanciaRepository.save(ambulancia));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!ambulanciaRepository.existsById(id)) throw new ResourceNotFoundException("Ambulância", id);
        ambulanciaRepository.deleteById(id);
    }

    @Transactional
    public AmbulanciaDTO atualizarStatus(Integer id, StatusAmbulanciaEnum status) {
        Ambulancia ambulancia = buscarPorId(id);
        ambulancia.atualizarStatus(status);
        return toDTOInternal(ambulanciaRepository.save(ambulancia));
    }

    // Usado internamente por ChamadoService (mesmo contexto transacional)
    @Transactional
    public Ambulancia atualizarStatusEntity(Integer id, StatusAmbulanciaEnum status) {
        Ambulancia ambulancia = buscarPorId(id);
        ambulancia.atualizarStatus(status);
        return ambulanciaRepository.save(ambulancia);
    }

    AmbulanciaDTO toDTOInternal(Ambulancia a) {
        return new AmbulanciaDTO(a.getId(), a.getPlaca(), a.getTipo(), a.getStatus(),
                a.getEmpresa()      != null ? a.getEmpresa().getCnpj()       : null,
                a.getEmpresa()      != null ? a.getEmpresa().getNome()       : null,
                a.getEquipeMedica() != null ? a.getEquipeMedica().getId()    : null,
                a.getEquipeMedica() != null ? a.getEquipeMedica().getNome()  : null);
    }
}
