package com.example.chamadoback.entity;
import java.util.List;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "PLANO")
public class Plano {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "cnpj_empresa", nullable = false)
    @JsonBackReference("empresa-planos")   // ← par do @JsonManagedReference em Empresa
    private Empresa empresa;

    @OneToMany(mappedBy = "plano")
    @JsonIgnore                            // ← QUEBRA ciclo Plano → Usuario → Plano
    private List<Usuario> usuarios;

    public Plano() {}
    public Plano(String nome, String descricao, Empresa empresa) {
        this.nome      = nome;
        this.descricao = descricao;
        this.empresa   = empresa;
    }

    public void vincularUsuario(Usuario usuario)   { usuario.setPlano(this); }
    public void desvincularUsuario(Usuario usuario) { usuario.setPlano(null); }
    public List<Usuario> listarUsuarios()           { return usuarios; }

    public Integer getId()               { return id; }
    public String getNome()              { return nome; }
    public void   setNome(String v)      { this.nome = v; }
    public String getDescricao()         { return descricao; }
    public void   setDescricao(String v) { this.descricao = v; }
    public Empresa getEmpresa()          { return empresa; }
    public void    setEmpresa(Empresa v) { this.empresa = v; }
    public List<Usuario> getUsuarios()   { return usuarios; }
    public void setUsuarios(List<Usuario> v) { this.usuarios = v; }
}
