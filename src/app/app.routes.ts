import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { InfoComponent } from './info/info.component';

export const routes: Routes = [
  {
    path: 'login',
    component: HomeComponent,
  },
  { path: 'info', component: InfoComponent },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
];
