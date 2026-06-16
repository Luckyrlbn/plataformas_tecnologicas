package com.example.demo.controller;

import com.example.demo.model.Perfil;
import com.example.demo.servicios.PerfilService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        String email    = credenciales.get("email");
        String password = credenciales.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email y password requeridos"));
        }

        return service.login(email, password)
                .map(perfil -> ResponseEntity.ok(Map.of(
                        "id",         perfil.getId(),
                        "nombre",     perfil.getNombre()     != null ? perfil.getNombre()     : "",
                        "email",      perfil.getEmail()      != null ? perfil.getEmail()      : "",
                        "alias",      perfil.getAlias()      != null ? perfil.getAlias()      : "",
                        "direccion",  perfil.getDireccion()  != null ? perfil.getDireccion()  : "",
                        "metodoPago", perfil.getMetodoPago() != null ? perfil.getMetodoPago() : "",
                        "rol",        perfil.getRol()        != null ? perfil.getRol()        : "cliente"
                )))
                .orElse(ResponseEntity.status(401)
                        .body(Map.of("error", "Email o contraseña incorrectos")));
    }
}
