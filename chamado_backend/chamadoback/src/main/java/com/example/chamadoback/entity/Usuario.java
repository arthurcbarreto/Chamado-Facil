package com.example.chamadoback.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "USUARIO")
public class Usuario {
    @Id
    @Column(length = 11)
    private String cpf;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(name = "dt_nasc", nullable = false)
    private LocalDate dataNascimento;

    @ManyToOne
    @JoinColumn(name = "id_plano", nullable = false)
    @JsonIgnore   // ← QUEBRA ciclo Usuario → Plano → usuarios → Usuario
    private Plano plano;

    @OneToMany(mappedBy = "usuario")
    @JsonIgnore   // ← QUEBRA ciclo Usuario → Chamado → usuario → Usuario
    private List<Chamado> chamados;

    public Usuario() {}
    public Usuario(String cpf, String nome, String email,
                   String senha, LocalDate dataNascimento, Plano plano) {
        this.cpf            = cpf;
        this.nome           = nome;
        this.email          = email;
        this.senha          = senha;
        this.dataNascimento = dataNascimento;
        this.plano          = plano;
    }

    public boolean realizarLogin(String email, String senha) {
        return this.email.equals(email) && this.senha.equals(senha);
    }
    public List<Chamado> consultarHistorico() { return chamados; }
    public List<Chamado> filtrarHistoricoPorData(LocalDate inicio, LocalDate fim) {
        return chamados.stream()
            .filter(c -> !c.getDataHoraPedido().toLocalDate().isBefore(inicio)
                      && !c.getDataHoraPedido().toLocalDate().isAfter(fim))
            .toList();
    }

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
    public Plano getPlano()                         { return plano; }
    public void  setPlano(Plano v)                  { this.plano = v; }
    public List<Chamado> getChamados()              { return chamados; }
    public void          setChamados(List<Chamado> v) { this.chamados = v; }
}
