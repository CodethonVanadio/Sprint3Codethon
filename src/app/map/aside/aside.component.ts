import { Component, Input } from '@angular/core';
import { MapComponent } from '../map.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent, NgFor],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  @Input() longitud: any = '';
  @Input() latitud: any = '';
  @Input() nombreCalle: any = '';
  @Input() routes: any = '';
}
