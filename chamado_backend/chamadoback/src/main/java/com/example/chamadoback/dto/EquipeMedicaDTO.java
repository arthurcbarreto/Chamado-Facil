package com.example.chamadoback.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EquipeMedicaDTO {

    private Integer id;

    @NotBlank(message = "Nome da equipe é obrigatório.")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Especialidade é obrigatória.")
    @Size(max = 100)
    private String especialidade;

    private List<String> membros;

    // Ambulância vinculada (resposta)
    private Integer idAmbulancia;
    private String  placaAmbulancia;

    // ── Construtores ──────────────────────────────────────────
    public EquipeMedicaDTO() {}

    public EquipeMedicaDTO(Integer id, String nome, String especialidade,
                            List<String> membros, Integer idAmbulancia,
                            String placaAmbulancia) {
        this.id              = id;
        this.nome            = nome;
        this.especialidade   = especialidade;
        this.membros         = membros;
        this.idAmbulancia    = idAmbulancia;
        this.placaAmbulancia = placaAmbulancia;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                       { return id; }
    public void    setId(Integer v)              { this.id = v; }

    public String getNome()                      { return nome; }
    public void   setNome(String v)              { this.nome = v; }

    public String getEspecialidade()             { return especialidade; }
    public void   setEspecialidade(String v)     { this.especialidade = v; }

    public List<String> getMembros()             { return membros; }
    public void         setMembros(List<String> v) { this.membros = v; }

    public Integer getIdAmbulancia()             { return idAmbulancia; }
    public void    setIdAmbulancia(Integer v)    { this.idAmbulancia = v; }

    public String getPlacaAmbulancia()           { return placaAmbulancia; }
    public void   setPlacaAmbulancia(String v)   { this.placaAmbulancia = v; }
}
