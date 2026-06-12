/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.controller;

import com.example.demo.model.Perfil;
import com.example.demo.servicios.PerfilService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author carlo
 */
@RestController
@RequestMapping("/api/perfiles")
@RequiredArgsConstructor

public class PerfilController {

    private final PerfilService service;

    @GetMapping
    public List<Perfil> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscar(@PathVariable Integer id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Perfil crear(@RequestBody Perfil p) {
        return service.guardar(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perfil> actualizar(
            @PathVariable Integer id,
            @RequestBody Perfil p) {
        return service.buscarPorId(id).map(existing -> {
            p.setId(id);
            return ResponseEntity.ok(service.guardar(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email y password requeridos"));
        }
        return service.login(email, password)
                .map(perfil -> ResponseEntity.ok(Map.of(
                "id", perfil.getId(),
                "nombre", perfil.getNombre(),
                "email", perfil.getEmail(),
                "alias", perfil.getAlias(),
                "mensaje", "Login exitoso"
        )))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Email o contraseña incorrectos")));
    }
}
