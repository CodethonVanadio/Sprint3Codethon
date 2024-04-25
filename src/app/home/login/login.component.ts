import { Component, Input } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AppComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() user: any = '';
  @Input() pass: any = '';

  alertMessage() {
    alert('cuidao!');
  }
}
