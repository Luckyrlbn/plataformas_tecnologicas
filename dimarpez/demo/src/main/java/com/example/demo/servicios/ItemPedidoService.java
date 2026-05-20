/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.servicios;

import com.example.demo.model.ItemPedido;
import com.example.demo.repositorio.ItemPedidoRepository;
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
public class ItemPedidoService {
     private final ItemPedidoRepository repo;

    public List<ItemPedido> listar() {
        return repo.findAll();
    }

    public ItemPedido guardar(ItemPedido p) {
        return repo.save(p);
    }

    public Optional<ItemPedido> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    public void eliminar(Integer id) {
        repo.deleteById(id);
    }
}
