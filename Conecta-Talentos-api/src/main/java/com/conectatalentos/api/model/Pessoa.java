package com.conectatalentos.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pessoas")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    private String cpf;
    private String cnpj;
    private String resumo;
    private String habilidades;
    private String disponibilidade;

    private String email;
    private String nome;

}