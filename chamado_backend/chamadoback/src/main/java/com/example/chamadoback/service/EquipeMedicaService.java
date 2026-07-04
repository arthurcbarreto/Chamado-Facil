package com.example.chamadoback.service;

import com.example.chamadoback.dto.EquipeMedicaDTO;
import com.example.chamadoback.entity.Ambulancia;
import com.example.chamadoback.entity.EquipeMedica;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.EquipeMedicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipeMedicaService {

    private final EquipeMedicaRepository equipeMedicaRepository;
    private final AmbulanciaService      ambulanciaService;

    public EquipeMedicaService(EquipeMedicaRepository equipeMedicaRepository, AmbulanciaService ambulanciaService) {
        this.equipeMedicaRepository = equipeMedicaRepository;
        this.ambulanciaService      = ambulanciaService;
    }

    @Transactional(readOnly = true)
    public EquipeMedica buscarPorId(Integer id) {
        return equipeMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipe Médica", id));
    }

    @Transactional(readOnly = true)
    public List<EquipeMedicaDTO> listarTodasDTO() {
        return equipeMedicaRepository.findAll().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EquipeMedicaDTO> listarDisponiveisDTO() {
        return equipeMedicaRepository.findByAmbulanciaIsNull().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EquipeMedicaDTO buscarPorIdDTO(Integer id) {
        return toDTOInternal(buscarPorId(id));
    }

    @Transactional
    public EquipeMedicaDTO criar(EquipeMedicaDTO dto) {
        EquipeMedica equipe = new EquipeMedica(dto.getNome(), dto.getEspecialidade());
        equipe.setMembros(dto.getMembros());
        return toDTOInternal(equipeMedicaRepository.save(equipe));
    }

    @Transactional
    public EquipeMedicaDTO editar(Integer id, EquipeMedicaDTO dto) {
        EquipeMedica equipe = buscarPorId(id);
        equipe.setNome(dto.getNome());
        equipe.setEspecialidade(dto.getEspecialidade());
        equipe.setMembros(dto.getMembros());
        return toDTOInternal(equipeMedicaRepository.save(equipe));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!equipeMedicaRepository.existsById(id)) throw new ResourceNotFoundException("Equipe Médica", id);
        equipeMedicaRepository.deleteById(id);
    }

    @Transactional
    public void vincularAmbulancia(Integer idEquipe, Integer idAmbulancia) {
        EquipeMedica equipe    = buscarPorId(idEquipe);
        Ambulancia   ambulancia = ambulanciaService.buscarPorId(idAmbulancia);
        if (ambulancia.getEquipeMedica() != null && !ambulancia.getEquipeMedica().getId().equals(idEquipe)) {
            throw new BusinessException("Esta ambulância já possui uma equipe vinculada. Desvincule primeiro.");
        }
        equipe.vincularAmbulancia(ambulancia);
        equipeMedicaRepository.save(equipe);
    }

    @Transactional
    public void desvincularAmbulancia(Integer idEquipe) {
        EquipeMedica equipe = buscarPorId(idEquipe);
        equipe.desvincularAmbulancia();
        equipeMedicaRepository.save(equipe);
    }

    EquipeMedicaDTO toDTOInternal(EquipeMedica e) {
        return new EquipeMedicaDTO(e.getId(), e.getNome(), e.getEspecialidade(), e.getMembros(),
                e.getAmbulancia() != null ? e.getAmbulancia().getId()    : null,
                e.getAmbulancia() != null ? e.getAmbulancia().getPlaca() : null);
    }
}
