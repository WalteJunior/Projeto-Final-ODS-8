package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Contratacao;
import com.conectatalentos.api.repository.ContratacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contratacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class ContratacaoController {

    @Autowired
    private ContratacaoRepository contratacaoRepository;

    @GetMapping
    public List<Contratacao> listar() {
        return contratacaoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Contratacao buscarPorId(@PathVariable Long id) {
        return contratacaoRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Contratacao criar(@RequestBody Contratacao contratacao) {
        return contratacaoRepository.save(contratacao);
    }

    @PutMapping("/{id}")
    public Contratacao atualizar(@PathVariable Long id, @RequestBody Contratacao contratacaoAtualizada) {
        Contratacao contratacao = contratacaoRepository.findById(id).orElseThrow();
        contratacao.setStatus(contratacaoAtualizada.getStatus());
        contratacao.setMensagem(contratacaoAtualizada.getMensagem());
        return contratacaoRepository.save(contratacao);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        contratacaoRepository.deleteById(id);
    }
}