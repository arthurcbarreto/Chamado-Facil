package com.example.chamadoback.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ENDERECO")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String logradouro;

    @Column(nullable = false, length = 10)
    private String numero;

    @Column(nullable = false, length = 80)
    private String bairro;

    @Column(nullable = false, length = 80)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(nullable = false, length = 8)
    private String cep;

    // ── Construtores ──────────────────────────────────────────
    public Endereco() {}

    public Endereco(String logradouro, String numero, String bairro,
                    String cidade, String estado, String cep) {
        this.logradouro = logradouro;
        this.numero     = numero;
        this.bairro     = bairro;
        this.cidade     = cidade;
        this.estado     = estado;
        this.cep        = cep;
    }

    // ── Métodos ───────────────────────────────────────────────
    public boolean validar() {
        return logradouro != null && !logradouro.isBlank()
            && numero     != null && !numero.isBlank()
            && bairro     != null && !bairro.isBlank()
            && cidade     != null && !cidade.isBlank()
            && estado     != null && estado.length() == 2
            && cep        != null && !cep.isBlank();
    }

    @Override
    public String toString() {
        return logradouro + ", " + numero + " - " + bairro
             + ", " + cidade + " - " + estado + ", CEP: " + cep;
    }

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                   { return id; }

    public String getLogradouro()            { return logradouro; }
    public void   setLogradouro(String v)    { this.logradouro = v; }

    public String getNumero()                { return numero; }
    public void   setNumero(String v)        { this.numero = v; }

    public String getBairro()                { return bairro; }
    public void   setBairro(String v)        { this.bairro = v; }

    public String getCidade()                { return cidade; }
    public void   setCidade(String v)        { this.cidade = v; }

    public String getEstado()                { return estado; }
    public void   setEstado(String v)        { this.estado = v; }

    public String getCep()                   { return cep; }
    public void   setCep(String v)           { this.cep = v; }
}
