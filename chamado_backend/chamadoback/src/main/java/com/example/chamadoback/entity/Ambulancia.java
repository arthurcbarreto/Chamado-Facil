package com.example.chamadoback.entity;

import com.example.chamadoback.converter.StatusAmbulanciaConverter;
import com.example.chamadoback.converter.TipoConverter;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.TipoEnum;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "AMBULANCIA")
public class Ambulancia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Convert(converter = TipoConverter.class)
    @Column(nullable = false)
    private TipoEnum tipo;

    @Convert(converter = StatusAmbulanciaConverter.class)
    @Column(nullable = false)
    private StatusAmbulanciaEnum status = StatusAmbulanciaEnum.DISPONIVEL;

    @ManyToOne
    @JoinColumn(name = "cnpj_empresa", nullable = false)
    @JsonBackReference("empresa-ambulancias")
    private Empresa empresa;

    @OneToOne(mappedBy = "ambulancia")
    @JsonManagedReference("ambulancia-equipe")
    private EquipeMedica equipeMedica;

    public Ambulancia() {}
    public Ambulancia(String placa, TipoEnum tipo, Empresa empresa) {
        this.placa   = placa;
        this.tipo    = tipo;
        this.empresa = empresa;
        this.status  = StatusAmbulanciaEnum.DISPONIVEL;
    }

    public void atualizarStatus(StatusAmbulanciaEnum novoStatus) { this.status = novoStatus; }
    public boolean verificarDisponibilidade() { return this.status == StatusAmbulanciaEnum.DISPONIVEL; }
    public void despachar(Chamado chamado) {
        if (!verificarDisponibilidade()) throw new IllegalStateException("Ambulância não está disponível.");
        this.status = StatusAmbulanciaEnum.EM_DESLOCAMENTO;
    }

    public Integer getId()                              { return id; }
    public String getPlaca()                            { return placa; }
    public void   setPlaca(String v)                    { this.placa = v; }
    public TipoEnum getTipo()                           { return tipo; }
    public void     setTipo(TipoEnum v)                 { this.tipo = v; }
    public StatusAmbulanciaEnum getStatus()             { return status; }
    public void setStatus(StatusAmbulanciaEnum v)       { this.status = v; }
    public Empresa getEmpresa()                         { return empresa; }
    public void    setEmpresa(Empresa v)                { this.empresa = v; }
    public EquipeMedica getEquipeMedica()               { return equipeMedica; }
    public void         setEquipeMedica(EquipeMedica v) { this.equipeMedica = v; }
}
