import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, AppComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userInfo = {
    user: 'admin',
    pass: 'admin',
  };
}
