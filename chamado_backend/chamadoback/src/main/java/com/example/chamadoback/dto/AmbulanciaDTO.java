package com.example.chamadoback.dto;

import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.TipoEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AmbulanciaDTO {

    private Integer id;

    @NotBlank(message = "Placa é obrigatória.")
    @Size(max = 10)
    private String placa;

    @NotNull(message = "Tipo é obrigatório.")
    private TipoEnum tipo;

    private StatusAmbulanciaEnum status;

    @NotBlank(message = "CNPJ da empresa é obrigatório.")
    private String cnpjEmpresa;

    // Campo de resposta apenas
    private String nomeEmpresa;

    // Equipe médica vinculada (resumo)
    private Integer idEquipeMedica;
    private String  nomeEquipeMedica;

    // ── Construtores ──────────────────────────────────────────
    public AmbulanciaDTO() {}

    public AmbulanciaDTO(Integer id, String placa, TipoEnum tipo,
                          StatusAmbulanciaEnum status, String cnpjEmpresa,
                          String nomeEmpresa, Integer idEquipeMedica, String nomeEquipeMedica) {
        this.id               = id;
        this.placa            = placa;
        this.tipo             = tipo;
        this.status           = status;
        this.cnpjEmpresa      = cnpjEmpresa;
        this.nomeEmpresa      = nomeEmpresa;
        this.idEquipeMedica   = idEquipeMedica;
        this.nomeEquipeMedica = nomeEquipeMedica;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                       { return id; }
    public void    setId(Integer v)              { this.id = v; }

    public String getPlaca()                     { return placa; }
    public void   setPlaca(String v)             { this.placa = v; }

    public TipoEnum getTipo()                    { return tipo; }
    public void     setTipo(TipoEnum v)          { this.tipo = v; }

    public StatusAmbulanciaEnum getStatus()      { return status; }
    public void setStatus(StatusAmbulanciaEnum v){ this.status = v; }

    public String getCnpjEmpresa()               { return cnpjEmpresa; }
    public void   setCnpjEmpresa(String v)       { this.cnpjEmpresa = v; }

    public String getNomeEmpresa()               { return nomeEmpresa; }
    public void   setNomeEmpresa(String v)       { this.nomeEmpresa = v; }

    public Integer getIdEquipeMedica()           { return idEquipeMedica; }
    public void    setIdEquipeMedica(Integer v)  { this.idEquipeMedica = v; }

    public String getNomeEquipeMedica()          { return nomeEquipeMedica; }
    public void   setNomeEquipeMedica(String v)  { this.nomeEquipeMedica = v; }
}
