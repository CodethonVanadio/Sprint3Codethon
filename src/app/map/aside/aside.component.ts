import { Component, Input } from '@angular/core';
import { MapComponent } from '../map.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  @Input() longitud: any = '';
  @Input() latitud: any = '';
}
