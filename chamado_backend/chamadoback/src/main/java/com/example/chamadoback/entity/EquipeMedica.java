package com.example.chamadoback.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "EQUIPE_MEDICA")
public class EquipeMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String especialidade;

    @ElementCollection
    @CollectionTable(
        name = "EQUIPE_MEMBROS",
        joinColumns = @JoinColumn(name = "id_equipe")
    )
    @Column(name = "membro", length = 100, nullable = false)
    private List<String> membros = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "id_ambulancia", unique = true)
    @JsonBackReference("ambulancia-equipe")
    private Ambulancia ambulancia;

    public EquipeMedica() {}
    public EquipeMedica(String nome, String especialidade) {
        this.nome          = nome;
        this.especialidade = especialidade;
    }

    public void vincularAmbulancia(Ambulancia a) {
        this.ambulancia = a;
        a.setEquipeMedica(this);
    }
    public void desvincularAmbulancia() {
        if (this.ambulancia != null) {
            this.ambulancia.setEquipeMedica(null);
            this.ambulancia = null;
        }
    }
    public List<String> listarMembros() { return membros; }

    public Integer getId()                         { return id; }
    public String  getNome()                       { return nome; }
    public void    setNome(String v)               { this.nome = v; }
    public String  getEspecialidade()              { return especialidade; }
    public void    setEspecialidade(String v)      { this.especialidade = v; }
    public List<String> getMembros()               { return membros; }
    public void         setMembros(List<String> v) { this.membros = v; }
    public Ambulancia   getAmbulancia()            { return ambulancia; }
    public void         setAmbulancia(Ambulancia v){ this.ambulancia = v; }
}