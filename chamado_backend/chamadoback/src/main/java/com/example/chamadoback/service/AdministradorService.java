package com.example.chamadoback.service;

import com.example.chamadoback.dto.AdministradorDTO;
import com.example.chamadoback.dto.AmbulanciaDTO;
import com.example.chamadoback.entity.Administrador;
import com.example.chamadoback.entity.Empresa;
import com.example.chamadoback.exception.BusinessException;
import com.example.chamadoback.exception.ResourceNotFoundException;
import com.example.chamadoback.repository.AdministradorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final EmpresaService          empresaService;
    private final AmbulanciaService       ambulanciaService;
    private final EquipeMedicaService     equipeMedicaService;
    private final PlanoService            planoService;
    private final PasswordEncoder         passwordEncoder;

    public AdministradorService(AdministradorRepository administradorRepository, EmpresaService empresaService,
                                 AmbulanciaService ambulanciaService, EquipeMedicaService equipeMedicaService,
                                 PlanoService planoService, PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.empresaService          = empresaService;
        this.ambulanciaService       = ambulanciaService;
        this.equipeMedicaService     = equipeMedicaService;
        this.planoService            = planoService;
        this.passwordEncoder         = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Administrador buscarPorId(Integer id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador", id));
    }

    @Transactional(readOnly = true)
    public List<AdministradorDTO> listarTodosDTO() {
        return administradorRepository.findAll().stream().map(this::toDTOInternal).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdministradorDTO buscarPorIdDTO(Integer id) {
        return toDTOInternal(buscarPorId(id));
    }

    @Transactional
    public AdministradorDTO criar(AdministradorDTO dto) {
        if (administradorRepository.existsByEmail(dto.getEmail()))
            throw new BusinessException("email", "E-mail já cadastrado.");
        Empresa empresa = empresaService.buscarPorCnpj(dto.getCnpjEmpresa());
        Administrador admin = new Administrador(dto.getNome(), dto.getEmail(),
                passwordEncoder.encode(dto.getSenha()), dto.getCargo(), empresa);
        return toDTOInternal(administradorRepository.save(admin));
    }

    public boolean login(String email, String senha) {
        Administrador admin = administradorRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Credenciais inválidas."));
        return passwordEncoder.matches(senha, admin.getSenha());
    }

    @Transactional
    public AdministradorDTO editar(Integer id, AdministradorDTO dto) {
        Administrador admin = buscarPorId(id);
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        admin.setCargo(dto.getCargo());
        return toDTOInternal(administradorRepository.save(admin));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!administradorRepository.existsById(id)) throw new ResourceNotFoundException("Administrador", id);
        administradorRepository.deleteById(id);
    }

    @Transactional
    public AmbulanciaDTO cadastrarAmbulancia(Integer idAdmin, AmbulanciaDTO dto) {
        Administrador admin = buscarPorId(idAdmin);
        dto.setCnpjEmpresa(admin.getEmpresa().getCnpj());
        return ambulanciaService.criar(dto);
    }

    @Transactional
    public void vincularEquipe(Integer idAdmin, Integer idEquipe, Integer idAmbulancia) {
        buscarPorId(idAdmin);
        equipeMedicaService.vincularAmbulancia(idEquipe, idAmbulancia);
    }

    @Transactional
    public void vincularUsuarioAoPlano(Integer idAdmin, Integer idPlano, String cpf) {
        buscarPorId(idAdmin);
        planoService.vincularUsuario(idPlano, cpf);
    }

    AdministradorDTO toDTOInternal(Administrador a) {
        return new AdministradorDTO(a.getId(), a.getNome(), a.getEmail(), a.getCargo(),
                a.getEmpresa() != null ? a.getEmpresa().getCnpj() : null,
                a.getEmpresa() != null ? a.getEmpresa().getNome() : null);
    }
}
