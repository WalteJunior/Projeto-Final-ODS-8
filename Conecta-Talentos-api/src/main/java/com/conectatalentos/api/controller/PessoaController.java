package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Pessoa;
import com.conectatalentos.api.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pessoas")
@CrossOrigin(origins = "http://localhost:5173")
public class PessoaController {

    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping
    public List<Pessoa> listar() {
        return pessoaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Pessoa buscarPorId(@PathVariable Long id) {
        return pessoaRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Pessoa criar(@RequestBody Pessoa pessoa) {
        return pessoaRepository.save(pessoa);
    }

    @PutMapping("/{id}")
    public Pessoa atualizar(@PathVariable Long id, @RequestBody Pessoa pessoaAtualizada) {
        Pessoa pessoa = pessoaRepository.findById(id).orElseThrow();
        pessoa.setResumo(pessoaAtualizada.getResumo());
        pessoa.setHabilidades(pessoaAtualizada.getHabilidades());
        pessoa.setDisponibilidade(pessoaAtualizada.getDisponibilidade());
        pessoa.setCpf(pessoaAtualizada.getCpf());
        pessoa.setCnpj(pessoaAtualizada.getCnpj());
        return pessoaRepository.save(pessoa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        pessoaRepository.deleteById(id);
    }
}