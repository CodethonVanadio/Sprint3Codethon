import { Component } from '@angular/core';
import { ChargingStationComponent } from '../charging-station/charging-station.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ChargingStationComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {}
