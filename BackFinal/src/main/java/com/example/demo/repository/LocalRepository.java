/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.demo.repository;

import com.example.demo.entity.Vehiculo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Alfonso
 */
public interface LocalRepository extends JpaRepository<Vehiculo, Long>{
    
    //Si quiero realizar consultas complejas
@Query("SELECT v FROM Vehiculo v WHERE v.matricula = :matricula")    
Optional<Vehiculo> findCarByNameWithJPQL(String matricula);
//Ahorrar tiempo con consultas básicas
Optional<Vehiculo>findBymatricula(String matricula);

//Consulta que le da igual como le mandes el parámtro, busca por coincidencia
Optional<Vehiculo>findBymatriculaIgnoreCase(String matricula);

}
