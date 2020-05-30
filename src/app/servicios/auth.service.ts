import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  public login(correo: string, clave: string) {
    this.auth.signInWithEmailAndPassword(correo, clave)
    .then(usuario => console.log(usuario));
  }

  public logout() {
    this.auth.signOut();
  }
}
