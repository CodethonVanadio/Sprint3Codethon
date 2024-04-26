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

          const iconCharger = L.icon({
            iconUrl: '../../../assets/images/charging-station.png',
            iconSize: [40, 40],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          })

          L.marker([latitude, longitude], { icon: customIcon })
            .addTo(this.map)
            .bindPopup('Usted se encuentra aquí')
            .openPopup();

            const objetoCombinado = JSON.parse(stringToJson);
            objetoCombinado.forEach((objeto: any) => {
              L.marker([objeto.AddressInfo.Latitude, objeto.AddressInfo.Longitude], { icon: iconCharger }) // Usar las propiedades Latitude y Longitude del objeto
                .addTo(this.map)
                .bindPopup(function() {
                  const container = document.createElement('div');
                  container.style.display = 'flex';
                  container.style.flexDirection = 'column';
                  container.style.gap = '1rem'

                  const cargador = document.createElement('strong');
                  cargador.textContent = 'Cargador:';
                  container.appendChild(cargador);

                  const id = document.createElement('span');
                  id.textContent = objeto.ID;
                  container.appendChild(id);

                  const ubicacion = document.createElement('strong');
                  ubicacion.textContent = 'Ubicación:';
                  container.appendChild(ubicacion);

                  const title = document.createElement('span');
                  title.textContent = objeto.AddressInfo.Title;
                  container.appendChild(title);

                  const calle = document.createElement('strong');
                  calle.textContent = 'Calle:';
                  container.appendChild(calle);

                  const address = document.createElement('span');
                  address.textContent = objeto.AddressInfo.AddressLine1;
                  container.appendChild(address);

                  return container;
                })
                .openPopup();
            });



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

let stringToJson =
  '[{"IsRecentlyVerified":false,"DateLastVerified":"2023-01-10T00:51:00Z","ID":209888,"UUID":"7846D64A-EB0F-4022-9E1F-2993EEF5E7AF","DataProviderID":1,"OperatorID":3583,"UsageTypeID":4,"UsageCost":"0,39\u20AC/kWh DC - 0,29\u20AC/kWh AC","AddressInfo":{"ID":210268,"Title":"Consum Moncada","AddressLine1":"Carrer Barcelona","Town":"Moncada","StateOrProvince":"Comunitat Valenciana","Postcode":"46115","CountryID":210,"Latitude":39.548561399221256,"Longitude":-0.3934133704528904,"DistanceUnit":0},"Connections":[{"ID":349303,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":30,"CurrentTypeID":30,"Quantity":1},{"ID":349304,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":150,"DateLastStatusUpdate":"2023-01-10T00:51:00Z","DataQualityLevel":1,"DateCreated":"2022-11-13T09:54:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-23T15:02:00Z","ID":203994,"UUID":"46331DA7-0278-4976-8F0F-0BE32E9F7B6D","DataProviderID":1,"OperatorID":1,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204361,"Title":"Ayunt. de Moncada - Coves Energy","AddressLine1":"Avinguda del Pais Valenci\u00E0","Town":"Moncada","StateOrProvince":"Comunitat Valenciana","Postcode":"46115","CountryID":210,"Latitude":39.54193859238242,"Longitude":-0.3920597987879546,"DistanceUnit":0},"Connections":[{"ID":340936,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-23T15:02:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T15:02:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-01-22T16:17:00Z","ID":212682,"UUID":"7821455D-686A-4265-8F18-2C84764FD5B8","DataProviderID":1,"OperatorID":3499,"UsageTypeID":1,"AddressInfo":{"ID":213062,"Title":"Mercadona Alfara del Patriarca","AddressLine1":"CV-315","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.54224926449132,"Longitude":-0.3876251629270371,"DistanceUnit":0},"Connections":[{"ID":354139,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":3.7,"CurrentTypeID":10,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-01-22T16:17:00Z","DataQualityLevel":1,"DateCreated":"2023-01-22T16:17:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-05-27T09:33:00Z","ID":210677,"UUID":"AEFC2158-9A0C-435B-B424-795D2C415465","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":"0,45\u20AC/kWh - 0,39\u20AC/kWh 22kW AC","AddressInfo":{"ID":211057,"Title":"Burger King Alfara","AddressLine1":"Burger King Alfara","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.541898368945965,"Longitude":-0.3871165070626148,"DistanceUnit":0},"Connections":[{"ID":351016,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":50,"CurrentTypeID":30,"Quantity":2},{"ID":351017,"ConnectionTypeID":2,"StatusTypeID":50,"LevelID":3,"PowerKW":50,"CurrentTypeID":30,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-05-27T09:33:00Z","DataQualityLevel":1,"DateCreated":"2022-12-14T14:55:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-11-21T18:30:00Z","ID":209887,"UUID":"95365E18-B984-45D4-AFDD-EB959E25FC43","DataProviderID":1,"OperatorID":3583,"UsageTypeID":4,"UsageCost":"0,39\u20AC/kWh DC - 0,29\u20AC/kWh AC","AddressInfo":{"ID":210267,"Title":"Consum Moncada","AddressLine1":"Carrer de Vicente Lasala","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.5429360593638,"Longitude":-0.3866659503789833,"DistanceUnit":0},"Connections":[{"ID":349301,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":30,"CurrentTypeID":30,"Quantity":1},{"ID":349302,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-11-21T18:30:00Z","DataQualityLevel":1,"DateCreated":"2022-11-13T09:48:00Z","SubmissionStatusTypeID":200}]';

// Parsear el JSON
const arrayDeObjetos = JSON.parse(stringToJson);

// Combina todos los objetos en uno solo
const objetoCombinado = Object.assign({}, ...arrayDeObjetos);

// Resultado
console.log(objetoCombinado);

// Acceder a las propiedades del objeto combinado
for (const key in objetoCombinado) {
  if (Object.hasOwnProperty.call(objetoCombinado, key)) {
    const element = objetoCombinado[key];
    console.log(key + ':', element);
  }
}

// O si deseas acceder a una propiedad específica, por ejemplo, ID
console.log('ID:', objetoCombinado.ID);
