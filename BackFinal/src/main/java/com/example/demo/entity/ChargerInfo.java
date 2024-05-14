package com.example.demo.entity;

public class ChargerInfo {
 private String nombre;
    private String direccion;
    private String poblacion;
    private String codigoPostal;
    private String comunidad;
    private String precio;
    private double latitud;
    private double longitud;

    public ChargerInfo() {
    }

    public ChargerInfo(String nombre, String direccion, String poblacion, String codigoPostal, String comunidad, String precio, double latitud, double longitud) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.poblacion = poblacion;
        this.codigoPostal = codigoPostal;
        this.comunidad = comunidad;
        this.precio = precio;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getPoblacion() {
        return poblacion;
    }

    public void setPoblacion(String poblacion) {
        this.poblacion = poblacion;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getComunidad() {
        return comunidad;
    }

    public void setComunidad(String comunidad) {
        this.comunidad = comunidad;
    }

    public String getPrecio() {
        return precio;
    }

    public void setPrecio(String precio) {
        this.precio = precio;
    }

    public double getLatitud() {
        return latitud;
    }

    public void setLatitud(double latitud) {
        this.latitud = latitud;
    }

    public double getLongitud() {
        return longitud;
    }

    public void setLongitud(double longitud) {
        this.longitud = longitud;
    }
    
    
    @Override
    public String toString(){
    return "nombre: " + nombre + "<br>direccion: " + direccion +
               "<br>poblacion: " + poblacion + "<br>codigoPostal: " + codigoPostal + 
               "<br>comunidad: " + comunidad + "<br>precio: " + precio + 
               "<br>latitud: " + latitud + "<br>longitud: " + longitud + 
               "<hr>";
    
    }
}
