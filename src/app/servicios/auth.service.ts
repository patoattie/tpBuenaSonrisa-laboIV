import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private auth2 = firebase.initializeApp(environment.firebaseConfig, 'adminProject');

  constructor(
    private auth: AngularFireAuth,
    private jwt: JwtHelperService
  ) {
    auth.idToken
    .subscribe(tokenUsuario => {
      this.token = tokenUsuario;
    });
  }

  public login(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(correo, clave);
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  public logoutLogueado(): Promise<void> {
    return this.auth2.auth().signOut();
  }

  public usuarioValido(): boolean {
    let retorno: boolean;

    try {
      retorno = !this.jwt.isTokenExpired(this.token);
    } catch (error) {
      retorno = false;
    }

    return retorno;
  }

  public getUsuario(): Observable<firebase.User> {
    return this.auth.authState;
  }

  public create(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(correo, clave);
  }

  public createLogueado(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth2.auth().createUserWithEmailAndPassword(correo, clave);
  }
}
