/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.servicios;

import com.example.demo.model.producto;
import com.example.demo.repositorio.productoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author carlo
 */

@Service
public class ProductoServicio {
    @Autowired
    private productoRepository ProductoRepository; 
    
    public List<producto> listarTodo(){
        return ProductoRepository.findAll(); 
    }
    
    public Optional <producto> buscarPorId(Long id){
        return ProductoRepository.findById(id); 
    }
    
    public producto guardar (producto Producto){
        return ProductoRepository.save(Producto); 
    }
    
    public void eliminar (long id){
        ProductoRepository.deleteById(id);
    }
}

