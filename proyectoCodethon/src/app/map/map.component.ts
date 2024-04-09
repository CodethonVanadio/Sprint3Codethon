import { Component } from '@angular/core';
import { AsideComponent } from './aside/aside.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AsideComponent, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

}
