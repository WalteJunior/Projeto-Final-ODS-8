package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.Usuario;
import com.conectatalentos.api.model.Pessoa;
import com.conectatalentos.api.model.Empresa;
import com.conectatalentos.api.repository.UsuarioRepository;
import com.conectatalentos.api.repository.PessoaRepository;
import com.conectatalentos.api.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cadastro")
@CrossOrigin(origins = "http://localhost:5173")
public class CadastroController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {

        // 1. salva o usuario e pega o id gerado
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // 2a. se for pessoa, cria o perfil de pessoa
        if ("pessoa".equals(usuario.getTipo())) {
            Pessoa pessoa = new Pessoa();
            pessoa.setUsuarioId(usuarioSalvo.getId());
            pessoa.setCpf(usuario.getCpf());
            pessoa.setEmail(usuario.getEmail());
            pessoa.setNome(usuario.getNome());
            pessoa.setDisponibilidade("ambos");
            pessoaRepository.save(pessoa);
        }

        // 2b. se for empresa, cria o perfil de empresa
        if ("empresa".equals(usuario.getTipo())) {
            Empresa empresa = new Empresa();
            empresa.setUsuarioId(usuarioSalvo.getId());
            empresa.setCnpj(usuario.getCnpj());
            empresa.setRazaoSocial(usuario.getNome()); // ← garante que não vai nulo
            empresa.setEmail(usuario.getEmail());
            empresaRepository.save(empresa);
        }

        return usuarioSalvo;
    }
}