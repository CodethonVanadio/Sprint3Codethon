import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapComponent } from '../map.component';
import { NgFor, NgIf } from '@angular/common';
import { AuthServiceService } from '../../auth-service.service';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordenada } from '../../intefaces';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent, NgFor, NgIf, FormsModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
@Injectable({
  providedIn: 'root',
})
export class AsideComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private http: HttpClient,
    private http2: HttpClient
  ) {}

  @Input() routes: any = '';
  @Input() ubicacion: Coordenada = {
    latitud: 0,
    longitud: 0,
  };
  @Input() funcionArreu: any = '';
  @Output() encontrarCargadores = new EventEmitter<Coordenada[]>();
  @Output() calculateRoute = new EventEmitter<Coordenada[]>();
  query = '';
  locations: any[] = [];
  selectedLocation: string = '';
  isInputDisabled: boolean = false;
  selectedLocations: any[] = [];
  nombreUbicacionActual: any;
  selectedCoordenadas: Coordenada[] = [];
  coordenadas: any = '';

  searchLocation(query: string): void {
    this.query = query;
    // Suponiendo que tienes acceso a la latitud y longitud de tu ubicación actual
    const latitudActual = this.ubicacion.latitud; // Reemplaza con la latitud de tu ubicación actual
    const longitudActual = this.ubicacion.longitud; // Reemplaza con la longitud de tu ubicación actual

    this.http
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&near=${latitudActual},${longitudActual}&zoom=18`
      )
      .subscribe(
        (response: any) => {
          this.locations = response;
          // Ordenar las ubicaciones por distancia aproximada
          this.locations.sort((a, b) => {
            const lat1 = parseFloat(a.lat);
            const lon1 = parseFloat(a.lon);
            const lat2 = parseFloat(b.lat);
            const lon2 = parseFloat(b.lon);

            const dLat = lat2 - lat1;
            const dLon = lon2 - lon1;

            const d =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));

            const distance = 6371 * c; // Distancia en kilómetros
            return distance; // Devuelve 0 para mantener el orden original si las distancias son iguales
          });
        },
        (error) => {
          console.error('Error al buscar ubicaciones:', error);
        }
      );
  }

  ngOnInit() {
    this.tipoCoche = this.authService.user.tipoCoche;
  }
  ngOnChanges() {
    if (
      this.ubicacion.latitud !== 0 &&
      this.ubicacion.longitud !== 0 &&
      !this.selectedCoordenadas.includes(this.ubicacion)
    ) {
      this.selectedCoordenadas.push(this.ubicacion);
    }
    this.buscarNombreUbicacion(this.ubicacion.latitud, this.ubicacion.longitud);

    console.log(this.ubicacion.latitud);
    console.log(this.ubicacion.longitud);
  }

  buscarNombreUbicacion(latitud: number, longitud: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`;
    this.http.get(url).subscribe(
      (response: any) => {
        this.nombreUbicacionActual = response.display_name;
        console.log(this.nombreUbicacionActual);
      },
      (error) => {
        console.error('Error al buscar la ubicación:', error);
      }
    );
  }

  selectLocation(locationName: string) {
    this.selectedLocation = locationName;
    this.isInputDisabled = true;
    this.query = '';
    this.selectedLocations.push(locationName);
    this.http
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}`
      )
      .subscribe(
        (response: any) => {
          const { lat, lon } = response[0];
          const coordenada: Coordenada = {
            latitud: lat,
            longitud: lon,
          };
          this.selectedCoordenadas.push(coordenada);
          const index = this.selectedCoordenadas.findIndex(
            (coord) => coord === coordenada
          );
          this.calculateRoute.emit([
            this.selectedCoordenadas[index - 1],
            coordenada,
          ]);
        },
        (error) => {
          console.error('Error al buscar ubicaciones:', error);
        }
      );
  }
  esconderAside(): void {
    let aside: HTMLElement | null = document.getElementById('aside');
    aside?.classList.toggle('hide');
    let asidePadre: HTMLElement | null = document.getElementById('asidePadre');
    if (asidePadre && aside) {
      // Check if asidePadre is not null
      if (aside.classList.contains('hide')) {
        asidePadre.style.top = '66%';
      }  else {
        asidePadre.style.top = '47%';
      }
    }
  }

  tipoCoche: string = '';

  get isLogged(): boolean {
    return this.authService.isLogged;
  }

  comenzarRuta() {
    this.encontrarCargadores.emit(this.selectedCoordenadas);
  }
}
