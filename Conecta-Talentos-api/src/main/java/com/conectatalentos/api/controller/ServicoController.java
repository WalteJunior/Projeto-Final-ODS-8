package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Servico;
import com.conectatalentos.api.repository.EmpresaRepository;
import com.conectatalentos.api.repository.PessoaRepository;
import com.conectatalentos.api.repository.ServicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
@CrossOrigin(origins = "http://localhost:5173")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    // Busca o dono do serviço (pessoa OU empresa) uma única vez e preenche os
    // campos transientes usados só na resposta da API, não no banco.
    private void preencherDadosDono(Servico servico) {
        if (servico.getPessoasId() != null) {
            pessoaRepository.findById(servico.getPessoasId()).ifPresent(pessoa -> {
                servico.setEmailUsuario(pessoa.getEmail());
                servico.setHabilidadesUsuario(pessoa.getHabilidades());
                servico.setNomeDono(pessoa.getNome());
            });
        } else if (servico.getEmpresaId() != null) {
            empresaRepository.findById(servico.getEmpresaId()).ifPresent(empresa -> {
                servico.setEmailUsuario(empresa.getEmail());
                servico.setNomeDono(empresa.getRazaoSocial());
            });
        }
    }

    @GetMapping
    public List<Servico> listar() {
        List<Servico> servicos = servicoRepository.findAll();
        servicos.forEach(this::preencherDadosDono);
        return servicos;
    }

    @PostMapping
    public Servico criar(@RequestBody Servico servico) {
        Servico salvo = servicoRepository.save(servico);
        preencherDadosDono(salvo);
        return salvo;
    }

    @PutMapping("/{id}")
    public Servico atualizar(@PathVariable Long id, @RequestBody Servico servicoAtualizado) {
        Servico servico = servicoRepository.findById(id).orElseThrow();
        servico.setTitulo(servicoAtualizado.getTitulo());
        servico.setDescricao(servicoAtualizado.getDescricao());
        servico.setPreco(servicoAtualizado.getPreco());
        servico.setCategoria(servicoAtualizado.getCategoria());
        Servico salvo = servicoRepository.save(servico);
        preencherDadosDono(salvo);
        return salvo;
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        servicoRepository.deleteById(id);
    }
}