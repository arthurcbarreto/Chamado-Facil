package com.example.chamadoback.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdministradorDTO {

    private Integer id;

    @NotBlank(message = "Nome é obrigatório.")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "E-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    @Size(max = 100)
    private String email;

    // Apenas na criação
    @NotBlank(message = "Senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;

    @NotBlank(message = "Cargo é obrigatório.")
    @Size(max = 80)
    private String cargo;

    @NotBlank(message = "CNPJ da empresa é obrigatório.")
    private String cnpjEmpresa;

    // Campo de resposta apenas
    private String nomeEmpresa;

    // ── Construtores ──────────────────────────────────────────
    public AdministradorDTO() {}

    public AdministradorDTO(Integer id, String nome, String email,
                             String cargo, String cnpjEmpresa, String nomeEmpresa) {
        this.id          = id;
        this.nome        = nome;
        this.email       = email;
        this.cargo       = cargo;
        this.cnpjEmpresa = cnpjEmpresa;
        this.nomeEmpresa = nomeEmpresa;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                   { return id; }
    public void    setId(Integer v)          { this.id = v; }

    public String getNome()                  { return nome; }
    public void   setNome(String v)          { this.nome = v; }

    public String getEmail()                 { return email; }
    public void   setEmail(String v)         { this.email = v; }

    public String getSenha()                 { return senha; }
    public void   setSenha(String v)         { this.senha = v; }

    public String getCargo()                 { return cargo; }
    public void   setCargo(String v)         { this.cargo = v; }

    public String getCnpjEmpresa()           { return cnpjEmpresa; }
    public void   setCnpjEmpresa(String v)   { this.cnpjEmpresa = v; }

    public String getNomeEmpresa()           { return nomeEmpresa; }
    public void   setNomeEmpresa(String v)   { this.nomeEmpresa = v; }
}
