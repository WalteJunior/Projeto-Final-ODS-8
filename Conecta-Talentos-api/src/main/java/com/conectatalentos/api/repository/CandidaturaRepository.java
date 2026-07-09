package com.conectatalentos.api.repository;

import com.conectatalentos.api.model.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
}