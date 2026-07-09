package com.conectatalentos.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pessoas_id")
    private Long pessoasId;

    @Column(name = "empresa_id")
    private Long empresaId;


    private String titulo;
    private String descricao;
    private Double preco;
    private String categoria;
    private Boolean disponivel;

    // Não é uma coluna da tabela "servicos" — é preenchido em tempo de execução
    // (no controller) com o e-mail do dono do serviço (pessoa OU empresa).
    @Transient
    private String emailUsuario;

    // Idem acima, mas para as habilidades do dono do serviço (só existe quando o dono é pessoa).
    @Transient
    private String habilidadesUsuario;

    // Idem acima: nome de quem publicou o serviço (nome da pessoa ou razão social da empresa).
    @Transient
    private String nomeDono;
}