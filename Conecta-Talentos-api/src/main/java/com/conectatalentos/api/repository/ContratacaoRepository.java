package com.conectatalentos.api.repository;

import com.conectatalentos.api.model.Contratacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratacaoRepository extends JpaRepository<Contratacao, Long> {
}