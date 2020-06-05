import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  public ingresar(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.login(correo, clave);
  }

  public salir(): Promise<void> {
    return this.auth.logout();
  }

  public usuarioValido(): boolean {
    return this.auth.usuarioValido();
  }

  public traerTodos() {
    return this.afs.collection<Usuario>('usuarios').valueChanges();
  }

  public alta(usuario: Usuario, clave: string) {
    if (usuario && clave) {
      this.auth.create(usuario.email, clave)
      .then(user => {
        usuario.providerId = user.user.providerId;
        usuario.uid = user.user.uid;

        user.user.updateProfile({
          displayName: usuario.displayName
        });

        this.afs.doc<Usuario>(`usuarios/${user.user.uid}`).set(usuario, {merge: true});
      })
      .catch(e => console.log(e));
    }
  }
}
