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
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    .subscribe((response: any) => {
        this.locations = response;
        // Suponiendo que cada ubicación tiene un nombre único, puedes asignar el primer resultado a selectedLocation
        if (this.locations.length > 0) {
          this.selectedLocation = this.locations[0].display_name;
          this.isInputDisabled = true;
        }
      }, error => {
        console.error('Error al buscar ubicaciones:', error);
      });
  }

  ngOnInit() {
    const latitud = 39.4966641;
    const longitud = -0.4219535;

    this.buscarNombreUbicacion(latitud, longitud);

    console.log(this.selectedCoordenadas);
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


  get tipoCoche(): string {
    return this.sharedService.tipoCoche;
  }

  get isLogged(): boolean {
    return this.sharedService.isLogged;
  }
}
