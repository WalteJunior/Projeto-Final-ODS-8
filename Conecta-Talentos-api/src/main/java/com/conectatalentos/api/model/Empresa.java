package com.conectatalentos.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    private String cnpj;

    @Column(name = "razaoSocial")
    private String razaoSocial;

    private String segmento;
    private String descricao;

    private String email;

}