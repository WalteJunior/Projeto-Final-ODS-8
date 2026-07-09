package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Empresa;
import com.conectatalentos.api.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
@CrossOrigin(origins = "http://localhost:5173")
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    @GetMapping
    public List<Empresa> listar() {
        return empresaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Empresa buscarPorId(@PathVariable Long id) {
        return empresaRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Empresa criar(@RequestBody Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    @PutMapping("/{id}")
    public Empresa atualizar(@PathVariable Long id, @RequestBody Empresa empresaAtualizada) {
        Empresa empresa = empresaRepository.findById(id).orElseThrow();
        empresa.setCnpj(empresaAtualizada.getCnpj());
        empresa.setRazaoSocial(empresaAtualizada.getRazaoSocial());
        empresa.setSegmento(empresaAtualizada.getSegmento());
        empresa.setDescricao(empresaAtualizada.getDescricao());
        return empresaRepository.save(empresa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        empresaRepository.deleteById(id);
    }
}