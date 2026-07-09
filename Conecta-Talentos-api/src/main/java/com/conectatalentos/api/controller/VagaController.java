package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Vaga;
import com.conectatalentos.api.repository.VagaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vagas")
@CrossOrigin(origins = "http://localhost:5173")
public class VagaController {

    @Autowired
    private VagaRepository vagaRepository;

    @GetMapping
    public List<Vaga> listar() {
        return vagaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Vaga buscarPorId(@PathVariable Long id) {
        return vagaRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Vaga criar(@RequestBody Vaga vaga) {
        return vagaRepository.save(vaga);
    }

    @PutMapping("/{id}")
    public Vaga atualizar(@PathVariable Long id, @RequestBody Vaga vagaAtualizada) {
        Vaga vaga = vagaRepository.findById(id).orElseThrow();
        vaga.setTitulo(vagaAtualizada.getTitulo());
        vaga.setDescricao(vagaAtualizada.getDescricao());
        vaga.setRequisitos(vagaAtualizada.getRequisitos());
        vaga.setBeneficios(vagaAtualizada.getBeneficios());
        vaga.setTipo(vagaAtualizada.getTipo());
        vaga.setArea(vagaAtualizada.getArea());
        vaga.setNivelSenioridade(vagaAtualizada.getNivelSenioridade());
        vaga.setLocalizacao(vagaAtualizada.getLocalizacao());
        vaga.setRemoto(vagaAtualizada.getRemoto());
        vaga.setSalario(vagaAtualizada.getSalario());
        vaga.setSalarioMinimo(vagaAtualizada.getSalarioMinimo());
        vaga.setSalarioMaximo(vagaAtualizada.getSalarioMaximo());
        vaga.setStatus(vagaAtualizada.getStatus());
        return vagaRepository.save(vaga);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        vagaRepository.deleteById(id);
    }
}