package com.example.chamadoback.dto;

import com.example.chamadoback.enums.GravidadeEnum;
import com.example.chamadoback.enums.StatusChamadoEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class ChamadoDTO {

    private Integer id;

    @NotBlank(message = "Sintomas são obrigatórios.")
    private String sintomas;

    @NotNull(message = "Gravidade é obrigatória.")
    private GravidadeEnum gravidade;

    private StatusChamadoEnum status;

    private LocalDateTime dataHoraPedido;
    private LocalDateTime dataHoraAtendimento;
    private LocalDateTime dataHoraConclusao;

    // Referências ao usuário
    @NotBlank(message = "CPF do usuário é obrigatório.")
    private String cpfUsuario;
    private String nomeUsuario;

    // Endereço da ocorrência
    @Valid
    @NotNull(message = "Endereço é obrigatório.")
    private EnderecoDTO endereco;

    // Ambulâncias associadas (apenas IDs e placas na resposta)
    private List<AmbulanciaResumoDTO> ambulancias;

    // ── Inner DTO para resumo de ambulância ───────────────────
    public static class AmbulanciaResumoDTO {
        private Integer id;
        private String  placa;
        private String  tipo;

        public AmbulanciaResumoDTO() {}

        public AmbulanciaResumoDTO(Integer id, String placa, String tipo) {
            this.id    = id;
            this.placa = placa;
            this.tipo  = tipo;
        }

        public Integer getId()          { return id; }
        public void    setId(Integer v) { this.id = v; }

        public String getPlaca()        { return placa; }
        public void   setPlaca(String v){ this.placa = v; }

        public String getTipo()         { return tipo; }
        public void   setTipo(String v) { this.tipo = v; }
    }

    // ── Construtores ──────────────────────────────────────────
    public ChamadoDTO() {}

    // ── Getters e Setters ─────────────────────────────────────
    public Integer getId()                              { return id; }
    public void    setId(Integer v)                     { this.id = v; }

    public String getSintomas()                         { return sintomas; }
    public void   setSintomas(String v)                 { this.sintomas = v; }

    public GravidadeEnum getGravidade()                 { return gravidade; }
    public void          setGravidade(GravidadeEnum v)  { this.gravidade = v; }

    public StatusChamadoEnum getStatus()                { return status; }
    public void              setStatus(StatusChamadoEnum v) { this.status = v; }

    public LocalDateTime getDataHoraPedido()            { return dataHoraPedido; }
    public void          setDataHoraPedido(LocalDateTime v) { this.dataHoraPedido = v; }

    public LocalDateTime getDataHoraAtendimento()       { return dataHoraAtendimento; }
    public void          setDataHoraAtendimento(LocalDateTime v) { this.dataHoraAtendimento = v; }

    public LocalDateTime getDataHoraConclusao()         { return dataHoraConclusao; }
    public void          setDataHoraConclusao(LocalDateTime v) { this.dataHoraConclusao = v; }

    public String getCpfUsuario()                       { return cpfUsuario; }
    public void   setCpfUsuario(String v)               { this.cpfUsuario = v; }

    public String getNomeUsuario()                      { return nomeUsuario; }
    public void   setNomeUsuario(String v)              { this.nomeUsuario = v; }

    public EnderecoDTO getEndereco()                    { return endereco; }
    public void        setEndereco(EnderecoDTO v)       { this.endereco = v; }

    public List<AmbulanciaResumoDTO> getAmbulancias()   { return ambulancias; }
    public void setAmbulancias(List<AmbulanciaResumoDTO> v) { this.ambulancias = v; }
}
