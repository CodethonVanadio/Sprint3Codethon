import { HeaderComponent } from './header/header.component';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AsideComponent } from './aside/aside.component';
import axios from 'axios';
import { Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ChargingStationComponent } from '../charging-station/charging-station.component';
import { Input } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<p>Example Component</p>',
})
export class ExampleComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Llamar al método getAddressFromCoordinates cuando se inicia el componente
    this.getAddressFromCoordinates(37.7749, -122.4194);
  }

  getAddressFromCoordinates(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    this.http.get(url).subscribe((response: any) => {
      const address = response.display_name;
      console.log('Ubicación:', address);
    });
  }
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AsideComponent, HeaderComponent, ChargingStationComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: any;
  longitud: any;
  latitud: any;
  longitud2: any;
  latitud2: any;
  taxiIcon: any;
  markers: Marker[] = [];
  marker: any;
  searchLocation: any;
  nombreCalle: any;
  routes: any;
  chargingStations: any[] = [];
  use: any = 0;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
    this.fetchPosts();

    /*    axios.get('http://localhost:8989/saludo').then(function (response) {
      console.log(response);
    }); */
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          this.updateMapAndData();
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario:', error);
        }
      );
    } else {
      console.error('Geolocalización no es compatible con este navegador.');
    }
  }

  updateMapAndData() {}

  fetchPosts() {
    const bbox = `(${this.latitud},${this.longitud}),(${this.latitud -20},${this.longitud -20})`;
    const url = `https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.8.6.1&verbose=false&output=json&includecomments=true&maxresults=40&compact=true&boundingbox=(${this.latitud},${this.longitud}),(${this.latitud -20},${this.longitud -20})&key=53f3079e-75c6-40eb-bc30-8b8792c9602f`;

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        this.chargingStations = response.data; // Ensure you're accessing the correct array
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        // Handle the error appropriately, e.g., show a message to the user
      });
  }
  initMap(): void {
    const baseMapLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      }
    );

    const baseMaps = {
      OpenStreetMaps: baseMapLayer,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          this.latitud = latitude;
          const longitude = position.coords.longitude;
          this.longitud = longitude;

          this.longitud2 = this.latitud + 20;
          this.latitud2 = this.longitud - 20;

          this.map = L.map('map')
            .setView([latitude, longitude], 13)
            .addLayer(baseMapLayer);

          const customIcon = L.icon({
            iconUrl: '../../../assets/images/iconoCoche.png',
            iconSize: [48, 48],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          const iconCharger = L.icon({
            iconUrl: '../../../assets/images/charging-station.png',
            iconSize: [40, 40],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          L.marker([latitude, longitude], { icon: customIcon })
            .addTo(this.map)
            .bindPopup('Usted se encuentra aquí')
            .openPopup();

          this.map.on('click', (e: any) => {
            console.log(e);
            const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {
              draggable: true,
            }).addTo(this.map);
            this.markers.push(newMarker);

            newMarker.on('dragend', (event) => {
              const latlng = event.target.getLatLng();
              newMarker.setLatLng(latlng);
            });
            L.Routing.control({
              waypoints: [
                L.latLng(this.latitud, this.longitud),
                L.latLng(e.latlng.lat, e.latlng.lng),
              ],
            })
              .on('routesfound', (e: any) => {
                const routes = e.routes;

                console.log(routes);
                const name = routes[0].name;
                this.nombreCalle = name;

                console.log(name);
                const distance = routes[0].summary.totalDistance;
                console.log(distance);

                e.routes[0].coordinates.forEach((coord: any, index: any) => {
                  this.routes = routes;
                  setTimeout(() => {
                    this.marker.setLatLng([coord.lat, coord.lng], {
                      draggable: true,
                    });
                  }, 100 * index);
                });
              })
              .addTo(this.map);
            this.markers.push(newMarker);
            console.log(this.markers);
          });

          this.chargingStations.forEach((station: any) => {
            if (
              this.use === '' ||
              this.use === undefined ||
              this.use === 'Desconocido'
            ) {
              this.use = 'Coste desconocido';
            } else this.use = station.UsageCost;

            L.marker(
              [station.AddressInfo.Latitude, station.AddressInfo.Longitude],
              { icon: iconCharger, draggable: true }
            )
              .addTo(this.map)
              .bindPopup(
                `<div class="infoCharger" style="color: red">
               <h3>Nombre :</h3> ${station.AddressInfo.Title}
               <h3>Coste de uso:</h3> ${this.use}
               <h3>Dirección:</h3> ${station.AddressInfo.AddressLine1}
             </div>`
              )
              .openPopup();
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario:', error);
        }
      );
    } else {
      console.error('Geolocalización no es compatible con este navegador.');
    }
  }
}
