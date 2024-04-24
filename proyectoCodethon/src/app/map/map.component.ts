import { Component } from '@angular/core';
import { AsideComponent } from './aside/aside.component';
import { HeaderComponent } from './header/header.component';
import { OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AsideComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: any;

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

    const pnoa = L.tileLayer.wms(
      'http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&',
      {
        layers: 'OI.OrthoimageCoverage', //nombre de la capa (ver get capabilities)
        format: 'image/jpeg',
        transparent: true,
        version: '1.3.0', //wms version (ver get capabilities)
        attribution:
          'PNOA WMS. Cedido por © Instituto Geográfico Nacional de España',
      }
    );

    const layerCodigosPostales = L.tileLayer.wms(
      'https://www.cartociudad.es/wms-inspire/direcciones-ccpp',
      {
        layers: 'codigo-postal',
        format: 'image/png',
        transparent: true,
        opacity: 1,
        attribution:
          '<a href="https://www.ign.es/" target="_blank">Instituto Geográfico Nacional</a>',
        maxZoom: 19,
      }
    );

    const layerIGNDirecciones = L.tileLayer.wms(
      'https://www.cartociudad.es/wms-inspire/direcciones-ccpp',
      {
        layers: 'AD.Address',
        format: 'image/png',
        transparent: true,
        opacity: 1,
        attribution:
          '<a href="https://www.ign.es/" target="_blank">Instituto Geográfico Nacional</a>',
        maxZoom: 19,
      }
    );

    const baseMaps = {
      OpenStreetMaps: baseMapLayer,
      Ortofoto: pnoa,
    };

    var customIcon = L.icon({
      iconUrl: '../../../assets/images/iconoCoche.png',
      iconSize: [48, 48],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    const overlays = {
      'Códigos Postales': layerCodigosPostales,
      Direcciones: layerIGNDirecciones,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

    this.map = L.map('map')
      .setView([latitude, longitude], 13)
      .addLayer(baseMapLayer);

    L.control
      .layers(baseMaps, overlays, {
        collapsed: false,
        // (Optional) The css class(es) used to indicated the group is expanded
        // (Optional) The css class(es) used to indicated the group is collapsed
      })
      .addTo(this.map);

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('Usted se encuentra aquí')
      .openPopup();
    }, error => {
      console.error('Error al obtener la ubicación del usuario:', error);
    });
  } else {
    console.error('Geolocalización no es compatible con este navegador.');
  }
}
}
