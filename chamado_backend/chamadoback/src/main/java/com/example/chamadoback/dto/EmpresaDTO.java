package com.example.chamadoback.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EmpresaDTO {

    @NotBlank(message = "CNPJ é obrigatório.")
    @Size(min = 14, max = 14, message = "CNPJ deve ter 14 dígitos numéricos.")
    private String cnpj;

    @NotBlank(message = "Nome é obrigatório.")
    @Size(max = 120)
    private String nome;

    @NotBlank(message = "Telefone é obrigatório.")
    @Size(max = 20)
    private String telefone;

    @Valid
    private EnderecoDTO endereco;

    // ── Construtores ──────────────────────────────────────────
    public EmpresaDTO() {}

    public EmpresaDTO(String cnpj, String nome, String telefone, EnderecoDTO endereco) {
        this.cnpj     = cnpj;
        this.nome     = nome;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public String getCnpj()                  { return cnpj; }
    public void   setCnpj(String v)          { this.cnpj = v; }

    public String getNome()                  { return nome; }
    public void   setNome(String v)          { this.nome = v; }

    public String getTelefone()              { return telefone; }
    public void   setTelefone(String v)      { this.telefone = v; }

    public EnderecoDTO getEndereco()         { return endereco; }
    public void        setEndereco(EnderecoDTO v) { this.endereco = v; }
}
