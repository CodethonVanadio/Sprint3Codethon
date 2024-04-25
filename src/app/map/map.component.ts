import { HeaderComponent } from './header/header.component';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AsideComponent } from './aside/aside.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AsideComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: any;
  longitud: any;
  latitude: any;
  taxiIcon: any;
  marker: any;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
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
          this.latitude = latitude;
          const longitude = position.coords.longitude;
          this.longitud = longitude;

          this.map = L.map('map')
            .setView([latitude, longitude], 13)
            .addLayer(baseMapLayer);

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
            const newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(
              this.map
            );
            L.Routing.control({
              waypoints: [
                L.latLng(this.latitude, this.longitud),
                L.latLng(e.latlng.lat, e.latlng.lng),
              ],
            })
              .on('routesfound', (e: any) => {
                const routes = e.routes;
                console.log(routes);

                e.routes[0].coordinates.forEach((coord: any, index: any) => {
                  setTimeout(() => {
                    this.marker.setLatLng([coord.lat, coord.lng]);
                  }, 100 * index);
                });
              })
              .addTo(this.map);
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
