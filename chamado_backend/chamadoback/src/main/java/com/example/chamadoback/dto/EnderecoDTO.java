package com.example.chamadoback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EnderecoDTO {

    private Integer id;

    @NotBlank(message = "Logradouro é obrigatório.")
    @Size(max = 150)
    private String logradouro;

    @NotBlank(message = "Número é obrigatório.")
    @Size(max = 10)
    private String numero;

    @NotBlank(message = "Bairro é obrigatório.")
    @Size(max = 80)
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória.")
    @Size(max = 80)
    private String cidade;

    @NotBlank(message = "Estado é obrigatório.")
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres.")
    private String estado;

    @NotBlank(message = "CEP é obrigatório.")
    @Size(min = 8 , max = 8)
    private String cep;

    // ── Construtores ──────────────────────────────────────────
    public EnderecoDTO() {}

    public EnderecoDTO(Integer id, String logradouro, String numero, String bairro,
                       String cidade, String estado, String cep) {
        this.id         = id;
        this.logradouro = logradouro;
        this.numero     = numero;
        this.bairro     = bairro;
        this.cidade     = cidade;
        this.estado     = estado;
        this.cep        = cep;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                { return id; }
    public void    setId(Integer v)       { this.id = v; }

    public String getLogradouro()         { return logradouro; }
    public void   setLogradouro(String v) { this.logradouro = v; }

    public String getNumero()             { return numero; }
    public void   setNumero(String v)     { this.numero = v; }

    public String getBairro()             { return bairro; }
    public void   setBairro(String v)     { this.bairro = v; }

    public String getCidade()             { return cidade; }
    public void   setCidade(String v)     { this.cidade = v; }

    public String getEstado()             { return estado; }
    public void   setEstado(String v)     { this.estado = v; }

    public String getCep()                { return cep; }
    public void   setCep(String v)        { this.cep = v; }
}
