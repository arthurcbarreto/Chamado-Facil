package com.example.chamadoback.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UsuarioDTO {

    public interface Cadastro {}
    public interface Edicao {}

    @NotBlank(message = "CPF é obrigatório.", groups = Cadastro.class)
    @Size(min = 11, max = 11, message = "CPF inválido.", groups = Cadastro.class)
    private String cpf;

    @NotBlank(message = "Nome é obrigatório.", groups = {Cadastro.class, Edicao.class})
    @Size(max = 100, groups = {Cadastro.class, Edicao.class})
    private String nome;

    @NotBlank(message = "E-mail é obrigatório.", groups = {Cadastro.class, Edicao.class})
    @Email(message = "E-mail inválido.", groups = {Cadastro.class, Edicao.class})
    @Size(max = 100, groups = {Cadastro.class, Edicao.class})
    private String email;

    @NotBlank(message = "Senha é obrigatória.", groups = Cadastro.class)
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.", groups = Cadastro.class)
    private String senha;

    @NotNull(message = "Data de nascimento é obrigatória.", groups = {Cadastro.class, Edicao.class})
    private LocalDate dataNascimento;

    @NotNull(message = "ID do plano é obrigatório.", groups = {Cadastro.class, Edicao.class})
    private Integer idPlano;

    private String nomePlano;

    // ── Construtores ──────────────────────────────────────────
    public UsuarioDTO() {}

    public UsuarioDTO(String cpf, String nome, String email,
                      LocalDate dataNascimento, Integer idPlano, String nomePlano) {
        this.cpf             = cpf;
        this.nome            = nome;
        this.email           = email;
        this.dataNascimento  = dataNascimento;
        this.idPlano         = idPlano;
        this.nomePlano       = nomePlano;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public String getCpf()                          { return cpf; }
    public void   setCpf(String v)                  { this.cpf = v; }

    public String getNome()                         { return nome; }
    public void   setNome(String v)                 { this.nome = v; }

    public String getEmail()                        { return email; }
    public void   setEmail(String v)                { this.email = v; }

    public String getSenha()                        { return senha; }
    public void   setSenha(String v)                { this.senha = v; }

    public LocalDate getDataNascimento()            { return dataNascimento; }
    public void      setDataNascimento(LocalDate v) { this.dataNascimento = v; }

    public Integer getIdPlano()                     { return idPlano; }
    public void    setIdPlano(Integer v)            { this.idPlano = v; }

    public String getNomePlano()                    { return nomePlano; }
    public void   setNomePlano(String v)            { this.nomePlano = v; }
}