import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly fakeUser = {
    username: 'admin',
    password: 'admin',
    tipoCoche: 'KIA e-Niro',
  };
  private readonly Alfonso = {
    username: 'Alfonso',
    password: 'admin',
    tipoCoche: 'Peugeot 206',
    casa: '39.52591, -0.41552',
  };
  private _tipoCoche: string = 'Coche no disponible';
  public isLogged: boolean = true;

  constructor() {}

  authenticate(username: string, password: string): boolean {
    if (username == this.fakeUser.username)
      this._tipoCoche = this.fakeUser.tipoCoche;
    else if (username == this.Alfonso.username)
      this._tipoCoche = this.Alfonso.tipoCoche;
    return (
      (username == this.fakeUser.username &&
        password == this.fakeUser.password) ||
      (username == this.Alfonso.username && password == this.Alfonso.password)
    );
  }

  get tipoCoche(): string {
    return this._tipoCoche;
  }

  set tipoCoche(value: string) {
    this._tipoCoche = value;
  }
}
