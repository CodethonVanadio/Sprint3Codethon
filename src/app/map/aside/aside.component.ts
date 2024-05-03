import { Component, Input } from '@angular/core';
import { MapComponent } from '../map.component';
import { AuthServiceService } from '../../auth-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent, NgIf],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})

export class AsideComponent {
  constructor(private sharedService: AuthServiceService) {}

  @Input() longitud: any = '';
  @Input() latitud: any = '';

  get tipoCoche(): string {
    return this.sharedService.tipoCoche;
  }

  get isLogged(): boolean {
    return this.sharedService.isLogged;
  }
}

