import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AppComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  userLogged: boolean = false;
  tipoCoche: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.authService.authenticate(this.username, this.password)) {
      this.userLogged = true;
      this.tipoCoche = this.authService.tipoCoche;
      this.authService.tipoCoche = this.tipoCoche;
      this.router.navigate(['/map']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
