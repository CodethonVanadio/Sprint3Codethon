import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly users: { [key: string]: any } = {
    Admin: {
      username: 'Admin',
      password: 'admin',
      tipoCoche: 'KIA e-Niro',
    },
    Alfonso: {
      username: 'Alfonso',
      password: 'admin',
      tipoCoche: 'Peugeot 206',
      casa: '39.52591, -0.41552',
    },
    Angel: {
      username: 'Angel',
      password: 'admin',
      tipoCoche: 'Bicicleta',
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
