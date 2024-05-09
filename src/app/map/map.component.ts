import { HeaderComponent } from './header/header.component';
import { Component, OnInit } from '@angular/core';
declare const L: any;
import 'leaflet';
import 'leaflet-routing-machine';
import { AsideComponent } from './aside/aside.component';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { ChargingStationComponent } from '../charging-station/charging-station.component';

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
  longitud2: any = 0;
  latitud2: any = 0;
  taxiIcon: any;
  markers: L.Marker[] = [];
  marker: any = L.marker([0, 0]);
  searchLocation: any;
  nombreCalle: any;
  routes: any[] = [];
  chargingStations: any[] = [];
  use: any = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
  }

  fetchPosts(latOrig: any, lngOrig: any, latDes: any, lngDes: any) {
    const url = `https://backend-tzzg.onrender.com/saludo`;
    const urlWithParams = url.concat(
      `?latitudOrigen=${latOrig}
      &longitudOrigen=${lngOrig}
      &latitudDestino=${latDes}
      &longitudDestino=${lngDes}`
    );

    axios
      .get(urlWithParams)
      .then((response) => {
        const stations = response.data;

        stations.map((station: any) => {
          const iconCharger = L.icon({
            iconUrl: '../../../assets/images/charging-station.png',
            iconSize: [35, 35],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          const marker = L.marker([station.latitud, station.longitud], {
            icon: iconCharger,
            draggable: false,
          })
            .setIcon(iconCharger)
            .addTo(this.map)
            .bindPopup(
              `<div class="infoCharger" style="color: red">
                            <h3>Nombre :</h3> ${station.nombre}
                            <h3>Coste de uso:</h3> ${
                              station.precio ? station.precio : 'desconocido'
                            }
                            <h3>Dirección:</h3> ${station.direccion}
                        </div>`
            )
            .openPopup();
        });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
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

          console.log(this.latitud2);
          console.log(this.longitud2);
          console.log(this.longitud);
          console.log(this.latitud);

          const customIcon = L.icon({
            iconUrl: '../../../assets/images/iconoCoche.png',
            /* shadowUrl: '../../../assets/images/mapArrow.svg', */
            iconSize: [48, 48],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          });

          L.marker([latitude, longitude], {
            icon: customIcon,
            draggable: false,
          })
            .addTo(this.map)
            .bindPopup('Usted se encuentra aquí')
            .openPopup();
          const markerIcon = L.icon({
            iconUrl: '../../../assets/images/map-pin.svg',

            iconSize: [40, 40],
            iconAnchor: [10, 40],
            popupAnchor: [0, -16],
            shadowSize: [40, 40],
          });
          this.map.on('click', (e: any) => {
            console.log(e);
            const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {
              icon: markerIcon,
              draggable: false,
            }).addTo(this.map);

            this.markers.push(newMarker);

            newMarker.on('dragend', (event: any) => {
              const latlng = event.target.getLatLng();
              newMarker.setLatLng(latlng);
            });

            console.log('No va');
            console.log(L, 'hola');
            console.log(L.Routing, 'hola');
            console.log(L.Routing.control, 'hola 2');

            L.Routing.control({
              waypoints: [
                L.latLng(this.latitud, this.longitud),
                L.latLng(e.latlng.lat, e.latlng.lng),
              ],
              createMarker: function () {
                return null;
              },
            })
              .on('routesfound', (e: any) => {
                const route = e.routes[0];
                const nextLat =
                  route.coordinates[route.coordinates.length - 1].lat;
                const nextLng =
                  route.coordinates[route.coordinates.length - 1].lng;

                this.fetchPosts(this.latitud, this.longitud, nextLat, nextLng);

                this.latitud = nextLat;
                this.longitud = nextLng;

                // console.log(routes);
                const name = route.name;
                this.routes.push(name);
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
