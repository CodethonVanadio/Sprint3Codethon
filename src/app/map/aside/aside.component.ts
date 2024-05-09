import { Component, Input, OnInit } from '@angular/core';
import { MapComponent } from '../map.component';
import { NgFor, NgIf } from '@angular/common';
import { AuthServiceService } from '../../auth-service.service';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent, NgFor, NgIf, FormsModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})

@Injectable({
  providedIn: 'root'
})

export class AsideComponent implements OnInit{
  constructor(private sharedService: AuthServiceService, private http: HttpClient, private http2: HttpClient) {}

  @Input() longitud: any = '';
  @Input() latitud: any = '';
  @Input() longitud2: any = '';
  @Input() latitud2: any = '';
  @Input() nombreCalle: any = '';
  @Input() routes: any = '';
  query = '';
  locations: any[] = [];
  selectedLocation: string = '';
  isInputDisabled: boolean = false;
  selectedLocations: any[] = [];
  nombreUbicacionActual: any;
  selectedCoordenadas: any[][] = [];
  coordenadas: any = '';
 
  searchLocation(query: string): void {
    this.query = query;
    // Suponiendo que tienes acceso a la latitud y longitud de tu ubicación actual
    const latitudActual = 39.5015900; // Reemplaza con la latitud de tu ubicación actual
    const longitudActual = -0.4475116; // Reemplaza con la longitud de tu ubicación actual
  
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&near=${latitudActual},${longitudActual}&zoom=18`)
     .subscribe((response: any) => {
        this.locations = response;
        // Ordenar las ubicaciones por distancia aproximada
        this.locations.sort((a, b) => {
          const lat1 = parseFloat(a.lat);
          const lon1 = parseFloat(a.lon);
          const lat2 = parseFloat(b.lat);
          const lon2 = parseFloat(b.lon);
  
          const dLat = lat2 - lat1;
          const dLon = lon2 - lon1;
  
          const d = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
  
          const distance = 6371 * c; // Distancia en kilómetros
          return distance; // Devuelve 0 para mantener el orden original si las distancias son iguales
        
        });
      }, error => {
        console.error('Error al buscar ubicaciones:', error);
      });
  }

  ngOnInit() {
    const latitud = 40.4245;
    const longitud = -3.6841;

    this.buscarNombreUbicacion(latitud, longitud);

    console.log(this.selectedCoordenadas);
    console.log(this.selectedLocations);

  }

  buscarNombreUbicacion(latitud: number, longitud: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`;
    this.http.get(url).subscribe(
      (response: any) => {
        this.nombreUbicacionActual = response.display_name;
        console.log(this.nombreUbicacionActual);
      },
      error => {
        console.error('Error al buscar la ubicación:', error);
      }
    );
  }

  selectLocation(locationName: string) {
    this.selectedLocation = locationName;
    this.isInputDisabled = true;
    this.query = '';
    this.selectedLocations.push(locationName);
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    .subscribe((response: any) => {
        console.log(response);
        this.coordenadas = [response[0].lat, response[0].lon];
        this.selectedCoordenadas.push(this.coordenadas);
        console.log(this.selectedCoordenadas);
      }, error => {
        console.error('Error al buscar ubicaciones:', error);
      });
  }

  esconderAside(){
    let aside = document.getElementById("aside");
    aside?.classList.toggle("hide");
  }

  get tipoCoche(): string {
    return this.sharedService.tipoCoche;
  }

  get isLogged(): boolean {
    return this.sharedService.isLogged;
  }
}
