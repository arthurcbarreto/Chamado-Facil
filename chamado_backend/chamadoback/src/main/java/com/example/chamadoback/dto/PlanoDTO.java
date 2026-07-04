package com.example.chamadoback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PlanoDTO {

    private Integer id;

    @NotBlank(message = "Nome do plano é obrigatório.")
    @Size(max = 100)
    private String nome;

    private String descricao;

    @NotBlank(message = "CNPJ da empresa é obrigatório.")
    private String cnpjEmpresa;

    // ── Construtores ──────────────────────────────────────────
    public PlanoDTO() {}

    public PlanoDTO(Integer id, String nome, String descricao, String cnpjEmpresa) {
        this.id          = id;
        this.nome        = nome;
        this.descricao   = descricao;
        this.cnpjEmpresa = cnpjEmpresa;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                   { return id; }
    public void    setId(Integer v)          { this.id = v; }

    public String getNome()                  { return nome; }
    public void   setNome(String v)          { this.nome = v; }

    public String getDescricao()             { return descricao; }
    public void   setDescricao(String v)     { this.descricao = v; }

    public String getCnpjEmpresa()           { return cnpjEmpresa; }
    public void   setCnpjEmpresa(String v)   { this.cnpjEmpresa = v; }
}
