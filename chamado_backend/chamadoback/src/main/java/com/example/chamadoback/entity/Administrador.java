package com.example.chamadoback.entity;

import com.example.chamadoback.enums.TipoEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ADMINISTRADOR")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(nullable = false, length = 80)
    private String cargo;

    @ManyToOne
    @JoinColumn(name = "cnpj_empresa", nullable = false)
    @JsonIgnore   // ← QUEBRA ciclo Admin → Empresa → ambulancias/planos → Empresa → ...
    private Empresa empresa;

    public Administrador() {}
    public Administrador(String nome, String email, String senha, String cargo, Empresa empresa) {
        this.nome    = nome;
        this.email   = email;
        this.senha   = senha;
        this.cargo   = cargo;
        this.empresa = empresa;
    }

    public boolean realizarLogin(String email, String senha) {
        return this.email.equals(email) && this.senha.equals(senha);
    }
    public void cadastrarAmbulancia(Ambulancia ambulancia)          { ambulancia.setEmpresa(this.empresa); }
    public void editarAmbulancia(Ambulancia ambulancia, String placa, TipoEnum tipo) {
        ambulancia.setPlaca(placa);
        ambulancia.setTipo(tipo);
    }
    public void removerAmbulancia(Ambulancia ambulancia)            { this.empresa.getAmbulancias().remove(ambulancia); }
    public void vincularEquipe(Ambulancia ambulancia, EquipeMedica equipe) { equipe.vincularAmbulancia(ambulancia); }
    public void vincularUsuarioAoPlano(Usuario usuario, Plano plano)      { plano.vincularUsuario(usuario); }
    public void gerirPlanos() {}

    public Integer getId()               { return id; }
    public String getNome()              { return nome; }
    public void   setNome(String v)      { this.nome = v; }
    public String getEmail()             { return email; }
    public void   setEmail(String v)     { this.email = v; }
    public String getSenha()             { return senha; }
    public void   setSenha(String v)     { this.senha = v; }
    public String getCargo()             { return cargo; }
    public void   setCargo(String v)     { this.cargo = v; }
    public Empresa getEmpresa()          { return empresa; }
    public void    setEmpresa(Empresa v) { this.empresa = v; }
}
