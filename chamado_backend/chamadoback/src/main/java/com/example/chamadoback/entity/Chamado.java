package com.example.chamadoback.entity;

import com.example.chamadoback.enums.GravidadeEnum;
import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import com.example.chamadoback.enums.StatusChamadoEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CHAMADO")
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dt_hora_pedido", nullable = false)
    private LocalDateTime dataHoraPedido;

    @Column(name = "dt_hora_atendimento")
    private LocalDateTime dataHoraAtendimento;

    @Column(name = "dt_hora_conclusao")
    private LocalDateTime dataHoraConclusao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sintomas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GravidadeEnum gravidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusChamadoEnum status = StatusChamadoEnum.ABERTO;

    @ManyToOne
    @JoinColumn(name = "cpf_usuario", nullable = false)
    @JsonIgnore   // ← QUEBRA ciclo Chamado → Usuario → chamados → Chamado
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_endereco", nullable = false)
    private Endereco endereco;

    @ManyToMany
    @JoinTable(
        name = "CHAMADO_AMBULANCIA",
        joinColumns = @JoinColumn(name = "id_chamado"),
        inverseJoinColumns = @JoinColumn(name = "id_ambulancia")
    )
    @JsonIgnore   // ← QUEBRA ciclo Chamado → Ambulancia → Empresa → ambulancias → ...
    private List<Ambulancia> ambulancias;

    public Chamado() {}
    public Chamado(String sintomas, GravidadeEnum gravidade, Usuario usuario, Endereco endereco) {
        this.sintomas  = sintomas;
        this.gravidade = gravidade;
        this.usuario   = usuario;
        this.endereco  = endereco;
    }

    public void registrar() {
        this.dataHoraPedido = LocalDateTime.now();
        this.status         = StatusChamadoEnum.ABERTO;
    }

    public GravidadeEnum verificarGravidade() { return this.gravidade; }

    public void atribuirAmbulancia(Ambulancia ambulancia) {
        if (!ambulancia.verificarDisponibilidade())
            throw new IllegalStateException("Ambulância não disponível.");
        this.ambulancias.add(ambulancia);
        ambulancia.atualizarStatus(StatusAmbulanciaEnum.EM_DESLOCAMENTO);
        this.status              = StatusChamadoEnum.EM_ATENDIMENTO;
        this.dataHoraAtendimento = LocalDateTime.now();
    }

    public void concluir() {
        this.status            = StatusChamadoEnum.CONCLUIDO;
        this.dataHoraConclusao = LocalDateTime.now();
        this.ambulancias.forEach(a -> a.atualizarStatus(StatusAmbulanciaEnum.DISPONIVEL));
    }

    public StatusChamadoEnum consultarStatus() { return this.status; }

    public Integer getId()                                   { return id; }
    public LocalDateTime getDataHoraPedido()                 { return dataHoraPedido; }
    public void          setDataHoraPedido(LocalDateTime v)  { this.dataHoraPedido = v; }
    public LocalDateTime getDataHoraAtendimento()            { return dataHoraAtendimento; }
    public void          setDataHoraAtendimento(LocalDateTime v) { this.dataHoraAtendimento = v; }
    public LocalDateTime getDataHoraConclusao()              { return dataHoraConclusao; }
    public void          setDataHoraConclusao(LocalDateTime v)   { this.dataHoraConclusao = v; }
    public String getSintomas()                              { return sintomas; }
    public void   setSintomas(String v)                      { this.sintomas = v; }
    public GravidadeEnum getGravidade()                      { return gravidade; }
    public void          setGravidade(GravidadeEnum v)       { this.gravidade = v; }
    public StatusChamadoEnum getStatus()                     { return status; }
    public void              setStatus(StatusChamadoEnum v)  { this.status = v; }
    public Usuario getUsuario()                              { return usuario; }
    public void    setUsuario(Usuario v)                     { this.usuario = v; }
    public Endereco getEndereco()                            { return endereco; }
    public void     setEndereco(Endereco v)                  { this.endereco = v; }
    public List<Ambulancia> getAmbulancias()                 { return ambulancias; }
    public void             setAmbulancias(List<Ambulancia> v) { this.ambulancias = v; }
}
