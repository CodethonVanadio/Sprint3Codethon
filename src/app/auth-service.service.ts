import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly fakeUser = { username: 'admin', password: 'admin' };
  public tipoCoche: string = 'Coche no disponible';
  public isLogged: boolean = true;

  constructor() {}

  authenticate(username: string, password: string): boolean {
    return (
      username == this.fakeUser.username && password == this.fakeUser.password
    );
  }
}
