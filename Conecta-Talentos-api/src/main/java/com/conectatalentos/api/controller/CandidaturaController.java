package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Candidatura;
import com.conectatalentos.api.repository.CandidaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidaturas")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidaturaController {

    @Autowired
    private CandidaturaRepository candidaturaRepository;

    @GetMapping
    public List<Candidatura> listar() {
        return candidaturaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Candidatura buscarPorId(@PathVariable Long id) {
        return candidaturaRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Candidatura criar(@RequestBody Candidatura candidatura) {
        return candidaturaRepository.save(candidatura);
    }

    @PutMapping("/{id}")
    public Candidatura atualizar(@PathVariable Long id, @RequestBody Candidatura candidaturaAtualizada) {
        Candidatura candidatura = candidaturaRepository.findById(id).orElseThrow();
        candidatura.setStatus(candidaturaAtualizada.getStatus());
        return candidaturaRepository.save(candidatura);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        candidaturaRepository.deleteById(id);
    }
}