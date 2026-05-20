/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.controller;

import com.example.demo.model.ItemPedido;
import com.example.demo.servicios.ItemPedidoService;
import java.util.List;
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
@RequestMapping("/api/items-pedido")
@RequiredArgsConstructor
public class ItemPedidoController {
    private final ItemPedidoService service;

    @GetMapping
    public List<ItemPedido> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemPedido> buscar(@PathVariable Integer id) {
        return service.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ItemPedido crear(@RequestBody ItemPedido p) {
        return service.guardar(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemPedido> actualizar(
            @PathVariable Integer id,
            @RequestBody ItemPedido p) {
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
}
