/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.repositorio;

import com.example.demo.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author carlo
 */
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Integer> {
    
}
