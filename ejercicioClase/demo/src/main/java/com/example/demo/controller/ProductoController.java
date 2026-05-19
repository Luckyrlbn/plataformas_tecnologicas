/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.controller;

import com.example.demo.model.producto;
import com.example.demo.servicios.ProductoServicio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/producto")
public class ProductoController {
        @Autowired
    private ProductoServicio service;

    @GetMapping
    public List<producto> listar() {
        return service.listarTodo();
    }

    @PostMapping
    public producto crear(@RequestBody producto producto) {
        return service.guardar(producto);
    }

    @GetMapping("/{id}")
    public producto buscar(@PathVariable Long id) {
        return service.buscarPorId(id).orElse(null);
    }
    

    @PutMapping("/{id}")
    public producto actualizar(@PathVariable Long id, @RequestBody producto producto) {
        producto.setId(id);
        return service.guardar(producto);
    }
        @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
