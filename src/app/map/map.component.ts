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
  imports: [AsideComponent, ChargingStationComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: any;
  longitud: any = 0;
  latitud: any = 0;
  longitud2: any = -3.9249;
  latitud2: any = -3.9249;
  taxiIcon: any;
  markers: Marker[] = [];
  marker: any = L.marker([0, 0]);
  searchLocation: any;
  nombreCalle: any;
  routes: any;
  chargingStations: any[] = [];
  use: any = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
  }

  fetchPosts() {
    const bbox = `(${this.latitud},${this.longitud}),(${this.latitud2},${this.longitud2})`;
    const url = `https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.8.6.1&verbose=false&output=json&includecomments=true&maxresults=40&compact=true&boundingbox=(${this.latitud},${this.longitud}),(${this.latitud2},${this.longitud2})&key=53f3079e-75c6-40eb-bc30-8b8792c9602f`;

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        this.chargingStations = response.data;
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });

    this.chargingStations.forEach((station: any) => {
      let use: string;
      if (
        station.UsageCost === '' ||
        station.UsageCost === undefined ||
        station.UsageCost === 'Desconocido'
      ) {
        use = 'Coste desconocido';
      } else {
        use = station.UsageCost;
      }

      console.log(station.AddressInfo.Latitude);
      console.log(station.AddressInfo.Longitude);

      const iconCharger = L.icon({
        iconUrl: '../../../assets/images/charging-station.png',
        iconSize: [40, 40],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      L.marker([station.AddressInfo.Latitude, station.AddressInfo.Longitude], {
        icon: iconCharger,
        draggable: true,
      })
        .addTo(this.map)
        .bindPopup(
          `<div class="infoCharger" style="color: red">
                        <h3>Nombre :</h3> ${station.AddressInfo.Title}
                        <h3>Coste de uso:</h3> ${use}
                        <h3>Dirección:</h3> ${station.AddressInfo.AddressLine1}
                    </div>`
        )
        .openPopup();

      console.log(station.AddressInfo.Latitude);
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

          this.map = L.map('map')
            .setView([latitude, longitude], 13)
            .addLayer(baseMapLayer);

          this.fetchPosts();

          console.log(this.latitud2);
          console.log(this.longitud2);
          console.log(this.longitud);
          console.log(this.longitud);

          const customIcon = L.icon({
            iconUrl: '../../../assets/images/iconoCoche.png',
            iconSize: [48, 48],
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
