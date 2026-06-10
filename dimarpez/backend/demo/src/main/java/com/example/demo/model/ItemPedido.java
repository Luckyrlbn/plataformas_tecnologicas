/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author carlo
 */
@Entity
@Table(name = "items_pedido")
@Data
@NoArgsConstructor

public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private BigDecimal precioUnit;
    private BigDecimal cantidadKg;
    private BigDecimal subtotal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PEDIDOS_id", nullable = false)
    @JsonBackReference
    private Pedido pedido;

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PRODUCTOS_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Producto producto;

}
