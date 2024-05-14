package com.example.demo.service;

import com.example.demo.entity.Vehiculo;
import com.example.demo.errors.LocalNotFoundException;
import com.example.demo.repository.LocalRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocalServiceImpl implements LocalService{

    @Autowired
    LocalRepository localRepository;
    
    
    @Override
    public List<Vehiculo> findAllVehicles() {
        return localRepository.findAll();
    }

    @Override
    public Vehiculo saveCars(Vehiculo vehiculo) {
        return localRepository.save(vehiculo);
    }

    @Override
    public Vehiculo updateCar(Long id, Vehiculo vehiculo) {
        Vehiculo car = localRepository.findById(id).get();
        
        if(Objects.nonNull(vehiculo.getMatricula())&& !"".equalsIgnoreCase(vehiculo.getMatricula())){
            car.setMatricula(vehiculo.getMatricula());
        }
        if(Objects.nonNull(vehiculo.getMarca())&& !"".equalsIgnoreCase(vehiculo.getMarca())){
            car.setMarca(vehiculo.getMarca());
        }
        
        if(Objects.nonNull(vehiculo.getModelo())&& !"".equalsIgnoreCase(vehiculo.getModelo())){
            car.setModelo(vehiculo.getModelo());
        }
        
        if(Objects.nonNull(vehiculo.getPropietario())&& !"".equalsIgnoreCase(vehiculo.getPropietario())){
            car.setPropietario(vehiculo.getPropietario());
        }
        return localRepository.save(car);
    }

    @Override
    public void deleteCar(Long id) {
        localRepository.deleteById(id);
    }

    @Override
    public Optional<Vehiculo>findCarByNameWithJPQL(String matricula) {
        return localRepository.findCarByNameWithJPQL(matricula);
    }

    @Override
    public Optional<Vehiculo> findBymatricula(String matricula) {
        return localRepository.findBymatricula(matricula);
    }

    @Override
    public Optional<Vehiculo> findBymatriculaIgnoreCase(String matricula) {
        return localRepository.findBymatriculaIgnoreCase(matricula);
    }

    @Override
    public Vehiculo findCarById(Long id) throws LocalNotFoundException{
        Optional<Vehiculo> vehiculo = localRepository.findById(id);
        if(!vehiculo.isPresent()){
            throw new LocalNotFoundException("Vehiculo is not available");
        
        }
        return vehiculo.get();
    }
    
}
