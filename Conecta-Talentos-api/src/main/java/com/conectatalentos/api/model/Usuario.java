package com.conectatalentos.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private String tipo;
    private String cpf;
    private String cnpj;
    private String telefone;

    @Column(name = "cadastro")
    private LocalDateTime cadastro;

    @PrePersist
    public void prePersist() {
        this.cadastro = LocalDateTime.now();
    }
}