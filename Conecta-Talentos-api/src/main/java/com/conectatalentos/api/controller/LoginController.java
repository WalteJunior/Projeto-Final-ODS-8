package com.conectatalentos.api.controller;

import com.conectatalentos.api.model.LoginRequest;
import com.conectatalentos.api.model.Usuario;
import com.conectatalentos.api.repository.UsuarioRepository;
import com.conectatalentos.api.repository.PessoaRepository;
import com.conectatalentos.api.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email não encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getSenha().equals(loginRequest.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Senha incorreta");
        }

        // monta a resposta com usuario + tipo de perfil
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", usuario.getId());
        resposta.put("nome", usuario.getNome());
        resposta.put("email", usuario.getEmail());
        resposta.put("tipo", usuario.getTipo());

        // verifica em qual tabela o usuario está vinculado
        if (pessoaRepository.findByUsuarioId(usuario.getId()).isPresent()) {
            resposta.put("perfil", "pessoa");
            resposta.put("perfilId", pessoaRepository.findByUsuarioId(usuario.getId()).get().getId());
        } else if (empresaRepository.findByUsuarioId(usuario.getId()).isPresent()) {
            resposta.put("perfil", "empresa");
            resposta.put("perfilId", empresaRepository.findByUsuarioId(usuario.getId()).get().getId());
        }

        return ResponseEntity.ok(resposta);
    }
}