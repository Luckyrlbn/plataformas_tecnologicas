/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author carlo
 */

@Entity
@Table(name = "items_pedido")
@Data @NoArgsConstructor @AllArgsConstructor
public class ItemPedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private BigDecimal precioUnit;
    private BigDecimal cantidadKg;
    private BigDecimal subtotal;

    @ManyToOne
    @JoinColumn(name = "PEDIDOS_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "PRODUCTOS_id", nullable = false)
    private Producto producto;
}
