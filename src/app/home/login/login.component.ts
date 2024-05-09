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
  isLogged: boolean = false;
  tipoCoche: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.authService.authenticate(this.username, this.password)) {
      this.router.navigate(['/map']);
      this.isLogged = true;
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
