import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private errorEvent = new Subject<string>();

  constructor(
    private auth: AngularFireAuth,
    private jwt: JwtHelperService
  ) {
    auth.idToken
    .subscribe(token => localStorage.setItem('token', token));

    auth.user
    .subscribe(usuario => localStorage.setItem('usuario', JSON.stringify(usuario)));
  }

  public login(correo: string, clave: string) {
    return this.auth.signInWithEmailAndPassword(correo, clave);
    /*.then(usuario => console.log(usuario))
    .catch(e => this.errorEvent.next(e.code));*/
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
    return localStorage.getItem('token');
  }

  /*public getError(): Observable<string> {
    return this.errorEvent.asObservable();
  }*/
}
