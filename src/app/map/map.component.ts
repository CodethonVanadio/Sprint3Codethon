import { HeaderComponent } from './header/header.component';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AsideComponent } from './aside/aside.component';
import axios from 'axios';
import { latLng, MapOptions, tileLayer, marker, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-example',
  template: '<p>Example Component</p>'
})
export class ExampleComponent implements OnInit {
  constructor(private http: HttpClient) { }

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
  imports: [AsideComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: any;
  longitud: any;
  latitude: any;
  taxiIcon: any;
  markers: Marker[] = [];
  marker: any;
  searchLocation: any;


  constructor() {}

  ngOnInit(): void {
    this.initMap();

    axios.get('http://localhost:8989/saludo').then(function (response) {
      console.log(response);
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
          });

          L.marker([latitude, longitude], { icon: customIcon})
            .addTo(this.map)
            .bindPopup('Usted se encuentra aquí')
            .openPopup();

          const objetoCombinado = JSON.parse(stringToJson);
          objetoCombinado.forEach((objeto: any) => {
            let use = objeto.UsageCost;

            console.log(use);

            if (use === '' || use === undefined || use === 'Desconocido') {
              use = 'me comes los cojones';
            } else use = objeto.UsageCost;
            L.marker(
              [objeto.AddressInfo.Latitude, objeto.AddressInfo.Longitude],
              { icon: iconCharger }
            ) // Usar las propiedades Latitude y Longitude del objeto
              .addTo(this.map)
              .bindPopup(
                `<div class="infoCharger" style="color: red">
                  <h3>Nombre :</h3> ${objeto.AddressInfo.Title}
                  <h3>Coste de uso:</h3> ${use}
                  <h3>Dirección:</h3> ${objeto.AddressInfo.AddressLine1}
                </div>`
              )
              .openPopup();
          });

          this.map.on('click', (e: any) => {
            console.log(e);
            const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {draggable: true}).addTo(
              this.map
            );
            this.markers.push(newMarker);
            
            newMarker.on('dragend', (event) => {
              const latlng = event.target.getLatLng();
              newMarker.setLatLng(latlng);
            });
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
                    this.marker.setLatLng([coord.lat, coord.lng], {draggable: true});
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
  '[{"IsRecentlyVerified":false,"DateLastVerified":"2023-01-10T00:51:00Z","ID":209888,"UUID":"7846D64A-EB0F-4022-9E1F-2993EEF5E7AF","DataProviderID":1,"OperatorID":3583,"UsageTypeID":4,"UsageCost":"0,39\u20AC/kWh DC - 0,29\u20AC/kWh AC","AddressInfo":{"ID":210268,"Title":"Consum Moncada","AddressLine1":"Carrer Barcelona","Town":"Moncada","StateOrProvince":"Comunitat Valenciana","Postcode":"46115","CountryID":210,"Latitude":39.548561399221256,"Longitude":-0.3934133704528904,"DistanceUnit":0},"Connections":[{"ID":349303,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":30,"CurrentTypeID":30,"Quantity":1},{"ID":349304,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":150,"DateLastStatusUpdate":"2023-01-10T00:51:00Z","DataQualityLevel":1,"DateCreated":"2022-11-13T09:54:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-23T15:02:00Z","ID":203994,"UUID":"46331DA7-0278-4976-8F0F-0BE32E9F7B6D","DataProviderID":1,"OperatorID":1,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204361,"Title":"Ayunt. de Moncada - Coves Energy","AddressLine1":"Avinguda del Pais Valenci\u00E0","Town":"Moncada","StateOrProvince":"Comunitat Valenciana","Postcode":"46115","CountryID":210,"Latitude":39.54193859238242,"Longitude":-0.3920597987879546,"DistanceUnit":0},"Connections":[{"ID":340936,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-23T15:02:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T15:02:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-01-22T16:17:00Z","ID":212682,"UUID":"7821455D-686A-4265-8F18-2C84764FD5B8","DataProviderID":1,"OperatorID":3499,"UsageTypeID":1,"AddressInfo":{"ID":213062,"Title":"Mercadona Alfara del Patriarca","AddressLine1":"CV-315","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.54224926449132,"Longitude":-0.3876251629270371,"DistanceUnit":0},"Connections":[{"ID":354139,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":3.7,"CurrentTypeID":10,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-01-22T16:17:00Z","DataQualityLevel":1,"DateCreated":"2023-01-22T16:17:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-05-27T09:33:00Z","ID":210677,"UUID":"AEFC2158-9A0C-435B-B424-795D2C415465","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":"0,45\u20AC/kWh - 0,39\u20AC/kWh 22kW AC","AddressInfo":{"ID":211057,"Title":"Burger King Alfara","AddressLine1":"Burger King Alfara","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.541898368945965,"Longitude":-0.3871165070626148,"DistanceUnit":0},"Connections":[{"ID":351016,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":50,"CurrentTypeID":30,"Quantity":2},{"ID":351017,"ConnectionTypeID":2,"StatusTypeID":50,"LevelID":3,"PowerKW":50,"CurrentTypeID":30,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-05-27T09:33:00Z","DataQualityLevel":1,"DateCreated":"2022-12-14T14:55:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-11-21T18:30:00Z","ID":209887,"UUID":"95365E18-B984-45D4-AFDD-EB959E25FC43","DataProviderID":1,"OperatorID":3583,"UsageTypeID":4,"UsageCost":"0,39\u20AC/kWh DC - 0,29\u20AC/kWh AC","AddressInfo":{"ID":210267,"Title":"Consum Moncada","AddressLine1":"Carrer de Vicente Lasala","StateOrProvince":"Comunitat Valenciana","Postcode":"46113","CountryID":210,"Latitude":39.5429360593638,"Longitude":-0.3866659503789833,"DistanceUnit":0},"Connections":[{"ID":349301,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":30,"CurrentTypeID":30,"Quantity":1},{"ID":349302,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-11-21T18:30:00Z","DataQualityLevel":1,"DateCreated":"2022-11-13T09:53:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-23T14:58:00Z","ID":203992,"UUID":"4D0520AE-0DD1-454D-8FA8-73CBB8FCD201","DataProviderID":1,"OperatorID":1,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204359,"Title":"Ayunt. Rocafort","AddressLine1":"Pla\u00E7a d\u0027Espanya","AddressLine2":"Hort de Ridaura","Town":"Rocafort","StateOrProvince":"Comunitat Valenciana","Postcode":"46111","CountryID":210,"Latitude":39.53218648517171,"Longitude":-0.41093529565455356,"DistanceUnit":0},"Connections":[{"ID":340934,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-23T14:58:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:58:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":true,"DateLastVerified":"2024-01-10T17:00:00Z","ID":203993,"UUID":"F9619F80-43CB-4AB4-99E1-391A6ABF73F0","DataProviderID":1,"OperatorID":3276,"UsageTypeID":4,"UsageCost":" 0,42\u20AC/kWh (0,05\u20AC/min parked without charging)","AddressInfo":{"ID":204360,"Title":"C.C. Heron City","AddressLine1":"Carrer Mar\u00EDa Moros Ag\u00FCes","AddressLine2":"Creu de Gr\u00E0cia","Town":"Paterna","StateOrProvince":"Comunitat Valenciana","Postcode":"46980","CountryID":210,"Latitude":39.529144266872464,"Longitude":-0.4416843021161583,"DistanceUnit":0},"Connections":[{"ID":340935,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":4}],"NumberOfPoints":4,"StatusTypeID":50,"DateLastStatusUpdate":"2024-01-10T17:00:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T15:00:00Z","SubmissionStatusTypeID":200},{"UserComments":[{"ID":28445,"ChargePointID":203985,"CommentTypeID":50,"UserName":"Madness","Comment":"2 hours max charge","Rating":5,"DateCreated":"2023-04-24T09:28:13.257Z","User":{"ID":45786,"Username":"Madness","ReputationPoints":1,"ProfileImageURL":"https://www.gravatar.com/avatar/9ab013ee378fd669c9bebd6651486a0c?s=80\u0026d=robohash"},"CheckinStatusTypeID":10,"IsActionedByEditor":false}],"IsRecentlyVerified":false,"DateLastVerified":"2023-04-24T09:28:00Z","ID":203985,"UUID":"E883C3C7-6D8C-4358-BC76-DA5BEEB96653","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":"free","AddressInfo":{"ID":204352,"Title":"Burjassot Calle Luis Vives","AddressLine1":"Avinguda dels Esports","Town":"Burjassot","StateOrProvince":"Comunitat Valenciana","Postcode":"46035","CountryID":210,"Latitude":39.50709687064111,"Longitude":-0.4169571470207529,"DistanceUnit":0},"Connections":[{"ID":340925,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-04-24T09:28:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:51:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-26T19:07:00Z","ID":203991,"UUID":"39C1A09E-3850-4B56-B390-F60AFCFA56C0","DataProviderID":1,"OperatorID":3499,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204358,"Title":"Mercadona Casas Verdes","AddressLine1":"Carrer de Santa Cecilia","AddressLine2":"Lloma Llarga","Town":"Paterna","StateOrProvince":"Comunitat Valenciana","Postcode":"46980","CountryID":210,"Latitude":39.51825798289181,"Longitude":-0.42266686419634425,"DistanceUnit":0},"Connections":[{"ID":340933,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":3.7,"CurrentTypeID":10,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-26T19:07:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:57:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-24T09:02:00Z","ID":204028,"UUID":"A3655599-ACDB-4550-8580-6D61AFA4782A","DataProviderID":1,"OperatorID":45,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204395,"Title":"Carrefour Paterna","AddressLine1":"Calle Cuiners","AddressLine2":"la Coma","Town":"Paterna","StateOrProvince":"Comunitat Valenciana","Postcode":"46980","CountryID":210,"Latitude":39.51445570288749,"Longitude":-0.4410953460753717,"DistanceUnit":0},"Connections":[{"ID":340984,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-24T09:02:00Z","DataQualityLevel":1,"DateCreated":"2022-09-24T09:02:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-12-14T14:37:00Z","ID":204030,"UUID":"BDD78E75-2DE1-47F3-B620-3CAA3E8726BC","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":" 0,20\u20AC/kWh","AddressInfo":{"ID":204397,"Title":"Feria Valencia","AddressLine1":"Carrer de l\u0027Ave Maria","AddressLine2":"Pobles de l\u0027Oest","StateOrProvince":"Comunitat Valenciana","Postcode":"46035","CountryID":210,"Latitude":39.504736293937896,"Longitude":-0.42506960674813854,"DistanceUnit":0},"Connections":[{"ID":340986,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":8}],"NumberOfPoints":8,"GeneralComments":"Accesible cuando el recinto ferial est\u00E1 abierto. Accessible during business hours","StatusTypeID":50,"DateLastStatusUpdate":"2022-12-14T14:37:00Z","DataQualityLevel":1,"DateCreated":"2022-09-24T09:05:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-10-29T13:58:00Z","ID":203986,"UUID":"BA8CAC1B-8346-4D86-93AC-48CB16225299","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":"free","AddressInfo":{"ID":204353,"Title":"Ayunt. de Burjassot (Mercado de L\u0027almara)","AddressLine1":"Calle Fernando Mart\u00EDn","Town":"Burjassot","StateOrProvince":"Comunitat Valenciana","Postcode":"46035","CountryID":210,"Latitude":39.50443210228906,"Longitude":-0.4106600333800543,"DistanceUnit":0},"Connections":[{"ID":340926,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-10-29T13:58:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:52:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-12-14T14:38:00Z","ID":203987,"UUID":"62BB3CD1-CFE5-4310-AAF4-E19ABABA6D0D","DataProviderID":1,"OperatorID":2247,"UsageTypeID":4,"UsageCost":"free","AddressInfo":{"ID":204354,"Title":"Plaza Sequera Ayuntamiento de Burjassot","AddressLine1":"Avinguda M\u00E0rtires de la Llibertat","Town":"Burjassot","StateOrProvince":"Comunitat Valenciana","Postcode":"46100","CountryID":210,"Latitude":39.50835584282024,"Longitude":-0.4112017561617449,"DistanceUnit":0},"Connections":[{"ID":340927,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":22,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-12-14T14:38:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:53:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-02-15T16:35:00Z","ID":203988,"UUID":"B30FA1C5-D952-466E-9C13-47373B2E374D","DataProviderID":1,"OperatorID":3499,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204355,"Title":"Mercadona Burjassot","AddressLine1":"Calle de Joaqu\u00EDn Navarro","Town":"Burjassot","StateOrProvince":"Comunitat Valenciana","Postcode":"46100","CountryID":210,"Latitude":39.51234638247382,"Longitude":-0.41071594805657696,"DistanceUnit":0},"Connections":[{"ID":340928,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":3.7,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":1,"StatusTypeID":50,"DateLastStatusUpdate":"2023-02-15T16:35:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:54:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-23T14:56:00Z","ID":203989,"UUID":"A804CD4A-E3BB-414C-82C1-1000C0745983","DataProviderID":1,"OperatorID":1,"UsageTypeID":1,"UsageCost":"","AddressInfo":{"ID":204356,"Title":"Ayunt. Godella","AddressLine1":"Calle Mayor","Town":"Godella","StateOrProvince":"Comunitat Valenciana","Postcode":"46100","CountryID":210,"Latitude":39.518406728142736,"Longitude":-0.4095604010332181,"DistanceUnit":0},"Connections":[{"ID":340929,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":11,"CurrentTypeID":20,"Quantity":2}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-23T14:56:00Z","DataQualityLevel":1,"DateCreated":"2022-09-23T14:56:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2023-02-22T17:35:00Z","ID":209889,"UUID":"4DB45C7C-E278-4431-AB70-E99185905031","DataProviderID":1,"OperatorID":3583,"UsageTypeID":4,"UsageCost":"0,39\u20AC/kWh DC - 0,29\u20AC/kWh AC","AddressInfo":{"ID":210269,"Title":"Consum Paterna","AddressLine1":"Carrer Santes Justa i Rufina","Town":"Paterna","StateOrProvince":"Comunitat Valenciana","Postcode":"46988","CountryID":210,"Latitude":39.50754493289415,"Longitude":-0.45265273838913345,"DistanceUnit":0},"Connections":[{"ID":349305,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"Amps":300,"Voltage":920,"PowerKW":120,"CurrentTypeID":30,"Quantity":2,"Comments":"Power electronics NB120 Charger. The DC charger allows charging one vehicle at 120kW, or two simultaneous charges at 60kW"},{"ID":349306,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2023-02-22T17:35:00Z","DataQualityLevel":1,"DateCreated":"2022-11-13T09:57:00Z","SubmissionStatusTypeID":200},{"IsRecentlyVerified":false,"DateLastVerified":"2022-09-24T09:01:00Z","ID":204027,"UUID":"E33B1388-8A06-4B40-B714-321AE49F3DE0","DataProviderID":1,"OperatorID":45,"UsageTypeID":6,"UsageCost":"","AddressInfo":{"ID":204394,"Title":"Hotel T\u00E1ctica by C\u0026R","AddressLine1":"Carrer dels Forners","AddressLine2":"la Coma","Town":"Paterna","StateOrProvince":"Comunitat Valenciana","Postcode":"46988","CountryID":210,"Latitude":39.512680582676666,"Longitude":-0.451806648533875,"DistanceUnit":0},"Connections":[{"ID":340982,"ConnectionTypeID":25,"StatusTypeID":50,"LevelID":2,"PowerKW":7.4,"CurrentTypeID":10,"Quantity":1},{"ID":340983,"ConnectionTypeID":28,"StatusTypeID":50,"LevelID":2,"PowerKW":3.7,"CurrentTypeID":10,"Quantity":1}],"NumberOfPoints":2,"StatusTypeID":50,"DateLastStatusUpdate":"2022-09-24T09:01:00Z","DataQualityLevel":1,"DateCreated":"2022-09-24T09:01:00Z","SubmissionStatusTypeID":200},{"UserComments":[{"ID":21316,"ChargePointID":71020,"CommentTypeID":10,"UserName":"PaoloG","Comment":"very close to highway","Rating":5,"DateCreated":"2019-08-11T12:44:02.96Z","User":{"ID":21259,"Username":"PaoloG","ReputationPoints":84,"ProfileImageURL":"https://www.gravatar.com/avatar/e1d5579408faf7b8d84c79c771f6eadf?s=80\u0026d=robohash"}}],"MediaItems":[{"ID":19180,"ChargePointID":71020,"ItemURL":"https://media.openchargemap.io/images/ES/OCM71020/OCM-71020.orig.2019081112461496.png","ItemThumbnailURL":"https://media.openchargemap.io/images/ES/OCM71020/OCM-71020.thmb.2019081112461496.png","Comment":"","IsEnabled":true,"IsVideo":false,"IsFeaturedItem":false,"IsExternalResource":false,"User":{"ID":21259,"Username":"PaoloG","ReputationPoints":84,"ProfileImageURL":"https://www.gravatar.com/avatar/e1d5579408faf7b8d84c79c771f6eadf?s=80\u0026d=robohash"},"DateCreated":"2019-08-11T12:47:00Z"},{"ID":19179,"ChargePointID":71020,"ItemURL":"https://media.openchargemap.io/images/ES/OCM71020/OCM-71020.orig.2019081112424999.png","ItemThumbnailURL":"https://media.openchargemap.io/images/ES/OCM71020/OCM-71020.thmb.2019081112424999.png","Comment":"","IsEnabled":true,"IsVideo":false,"IsFeaturedItem":false,"IsExternalResource":false,"User":{"ID":21259,"Username":"PaoloG","ReputationPoints":84,"ProfileImageURL":"https://www.gravatar.com/avatar/e1d5579408faf7b8d84c79c771f6eadf?s=80\u0026d=robohash"},"DateCreated":"2019-08-11T12:43:00Z"}],"IsRecentlyVerified":false,"DateLastVerified":"2023-10-12T10:35:00Z","ID":71020,"UUID":"B4C077C6-249D-48B3-838E-688A83BA6570","DataProviderID":1,"OperatorID":3534,"OperatorsReference":"19234","UsageTypeID":4,"UsageCost":"","AddressInfo":{"ID":71366,"Title":"Valencia Tesla Supercharger","AddressLine1":"Carrer de Leonardo da Vinci, 1","Town":"Valencia","StateOrProvince":"Valencia","Postcode":"46980","CountryID":210,"Latitude":39.5432044,"Longitude":-0.451270199999954,"RelatedURL":"https://www.teslamotors.com/supercharger","DistanceUnit":0},"Connections":[{"ID":101763,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":150,"CurrentTypeID":30,"Quantity":4,"Comments":"V2 (CCS\u002BTesla S/X connector)"},{"ID":349562,"ConnectionTypeID":33,"StatusTypeID":50,"LevelID":3,"PowerKW":250,"CurrentTypeID":30,"Quantity":4,"Comments":"V3"}],"NumberOfPoints":8,"GeneralComments":"4 V2 superchargers 150kW (CCS\u002BTesla S/X connector). Each two A/B chargers share 150kW of the power cabinet\u002B 4 V3 superchargers 250 kW (CCS)","StatusTypeID":50,"DateLastStatusUpdate":"2023-10-12T10:35:00Z","DataQualityLevel":1,"DateCreated":"2016-08-22T18:30:00Z","SubmissionStatusTypeID":200}]';

/* // Parsear el JSON
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
 */
