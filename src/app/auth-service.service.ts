import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly users: { [key: string]: any } = {
    admin: {
      username: 'Admin',
      password: 'admin',
      tipoCoche: 'KIA e-Niro',
    },
    alfonso: {
      username: 'Alfonso',
      password: 'admin',
      tipoCoche: 'Peugeot 206',
      casa: '39.52591, -0.41552',
    },
  };
  public user: any = null;
  public isLogged: boolean = false;

  constructor() {}

  authenticate(username: string, password: string): boolean {
    const user = this.users[username];

    if (user && user.password == password) {
      this.user = user;
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    return this.isLogged;
  }

  logOut() {
    this.isLogged = false;
    this.user = null;
  }
}
