package com.conectatalentos.api.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String senha;
}