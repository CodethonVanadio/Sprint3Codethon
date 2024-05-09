import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private authService: AuthServiceService) {}
  iniciaSesion: string = '';
  isLogged: boolean = false;

  ngOnInit() {
    if (this.authService.isLogged) {
      this.isLogged = this.authService.isLogged;
      console.log(this.isLogged);
      this.iniciaSesion = `Bienvenido ${this.authService.user.username}`;
    }
  }

  logOut() {
    this.authService.logOut();
    this.isLogged = false;
    this.iniciaSesion = '';
  }
}
