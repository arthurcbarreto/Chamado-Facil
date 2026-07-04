package com.example.chamadoback.entity;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "EMPRESA")
public class Empresa {
    @Id
    @Column(length = 14)
    private String cnpj;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 20)
    private String telefone;

    @OneToOne
    @JoinColumn(name = "id_endereco", nullable = false)
    private Endereco endereco;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    @JsonManagedReference("empresa-ambulancias")   // ← par do @JsonBackReference em Ambulancia
    private List<Ambulancia> ambulancias;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    @JsonManagedReference("empresa-planos")        // ← par do @JsonBackReference em Plano
    private List<Plano> planos;

    public Empresa() {}
    public Empresa(String cnpj, String nome, String telefone, Endereco endereco) {
        this.cnpj     = cnpj;
        this.nome     = nome;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    public List<Ambulancia> listarAmbulâncias() { return ambulancias; }
    public List<Plano> listarPlanos()           { return planos; }

    public String getCnpj()                  { return cnpj; }
    public void   setCnpj(String v)          { this.cnpj = v; }
    public String getNome()                  { return nome; }
    public void   setNome(String v)          { this.nome = v; }
    public String getTelefone()              { return telefone; }
    public void   setTelefone(String v)      { this.telefone = v; }
    public Endereco getEndereco()            { return endereco; }
    public void     setEndereco(Endereco v)  { this.endereco = v; }
    public List<Ambulancia> getAmbulancias()          { return ambulancias; }
    public void             setAmbulancias(List<Ambulancia> v) { this.ambulancias = v; }
    public List<Plano> getPlanos()           { return planos; }
    public void        setPlanos(List<Plano> v) { this.planos = v; }
}
