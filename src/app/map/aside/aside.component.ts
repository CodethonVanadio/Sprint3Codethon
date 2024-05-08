import { Component, Input } from '@angular/core';
import { MapComponent } from '../map.component';
import { NgFor } from '@angular/common';
import { AuthServiceService } from '../../auth-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent, NgFor, NgIf],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  constructor(private sharedService: AuthServiceService) {}

  @Input() longitud: any = '';
  @Input() latitud: any = '';
  @Input() longitud2: any = '';
  @Input() latitud2: any = '';
  @Input() nombreCalle: any = '';
  @Input() routes: any = '';

  get tipoCoche(): string {
    return this.sharedService.tipoCoche;
  }

  get isLogged(): boolean {
    return this.sharedService.isLogged;
  }
}
