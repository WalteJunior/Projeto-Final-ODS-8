package com.conectatalentos.api.repository;

import com.conectatalentos.api.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VagaRepository extends JpaRepository<Vaga, Long> {
}