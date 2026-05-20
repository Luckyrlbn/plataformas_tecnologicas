/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.servicios;

import com.example.demo.model.Pedido;
import com.example.demo.repositorio.PedidoRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author carlo
 */

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository repo;

    public List<Pedido> listar() {
        return repo.findAll();
    }

    public Pedido guardar(Pedido p) {
        return repo.save(p);
    }

    public Optional<Pedido> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    public void eliminar(Integer id) {
        repo.deleteById(id);
    }
}
