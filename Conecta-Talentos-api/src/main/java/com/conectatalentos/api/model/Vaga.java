package com.conectatalentos.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vagas")
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private String requisitos;
    private String beneficios;
    private String tipo;
    private String area;
    private String nivelSenioridade;
    private String localizacao;
    private Boolean remoto;
    private Double salario;
    private Double salarioMinimo;
    private Double salarioMaximo;
    private String status;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "aberta";
    }
}