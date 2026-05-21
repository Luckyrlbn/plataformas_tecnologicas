/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.servicios;

import com.example.demo.model.ItemPedido;
import com.example.demo.model.Pedido;
import com.example.demo.repositorio.PedidoRepository;
import java.math.BigDecimal;
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

 public Pedido guardar(Pedido pedido) {
    if (pedido.getItems() != null) {
        for (ItemPedido item : pedido.getItems()) {
            item.setPedido(pedido);
        }
        BigDecimal total = pedido.getItems().stream()
            .map(ItemPedido::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);
    }
    Pedido guardado = repo.save(pedido);
    return repo.findById(guardado.getId()).orElse(guardado); 
}

    public Optional<Pedido> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    public void eliminar(Integer id) {
        repo.deleteById(id);
    }
}
