/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo.servicios;

import com.example.demo.model.Perfil;
import com.example.demo.repositorio.PerfilRepository;
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
public class PerfilService {
    private final PerfilRepository repo;

    public List<Perfil> listar() {
        return repo.findAll();
    }

    public Perfil guardar(Perfil p) {
        return repo.save(p);
    }

    public Optional<Perfil> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    public void eliminar(Integer id) {
        repo.deleteById(id);
    }
}
