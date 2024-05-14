/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.demo.service;

import com.example.demo.entity.Vehiculo;
import com.example.demo.errors.LocalNotFoundException;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author Alfonso
 */
public interface LocalService {

    List<Vehiculo>findAllVehicles(); 
    Vehiculo saveCars(Vehiculo vehiculo);
    Vehiculo updateCar(Long id,Vehiculo vehiculo);
    void deleteCar(Long id);
    Optional<Vehiculo>findCarByNameWithJPQL(String matricula);
    Optional<Vehiculo>findBymatricula(String matricula);
    Optional<Vehiculo>findBymatriculaIgnoreCase(String matricula);
    
    Vehiculo findCarById(Long id)throws LocalNotFoundException;
}
