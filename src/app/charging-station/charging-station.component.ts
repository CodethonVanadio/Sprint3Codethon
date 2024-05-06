import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-charging-station',
  templateUrl: './charging-station.component.html',
  styleUrls: ['./charging-station.component.css'],
  standalone: true,
  imports: [NgFor],
})
export class ChargingStationComponent implements OnInit {
  chargingStations: any[] = [];

  @Input() longitud: number = 0;
  @Input() latitud: number = 0;
  @Input() longitud2: number = 0;
  @Input() latitud2: number = 0;

  

  constructor() {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    const bbox = `(${this.latitud},${this.longitud}),(${this.latitud2},${this.longitud2})`;
    const url = `https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.8.6.1&verbose=false&output=json&includecomments=true&maxresults=40&compact=true&boundingbox=${bbox}&key=53f3079e-75c6-40eb-bc30-8b8792c9602f`;

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        this.chargingStations = response.data; // Asegúrate de acceder al array correcto
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
