package com.conectatalentos.api.repository;

import com.conectatalentos.api.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    Optional<Pessoa> findByUsuarioId(Long usuarioId);
}