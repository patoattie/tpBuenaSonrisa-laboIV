import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private jwt: JwtHelperService
  ) {
    auth.idToken
    .subscribe(token => localStorage.setItem('usuario', token));
  }

  public login(correo: string, clave: string) {
    this.auth.signInWithEmailAndPassword(correo, clave)
    .then(usuario => console.log(usuario));
  }

  public logout() {
    this.auth.signOut();
  }

  public usuarioValido(): boolean {
    let retorno: boolean;

    try {
      retorno = !this.jwt.isTokenExpired(this.getToken());
    } catch (error) {
      retorno = false;
    }

    return retorno;
  }

  private getToken(): string {
    return localStorage.getItem('usuario');
  }
}
