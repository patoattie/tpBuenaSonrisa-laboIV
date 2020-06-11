import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from '../clases/usuario';
import { TipoUsuario } from '../enums/tipo-usuario.enum';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuario: Usuario;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private pipe: DatePipe,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    auth.getUsuario()
    .subscribe(user => {
      if (user) {
        this.router.navigate(['principal']);
        this.traerUno(user.uid)
        .subscribe(unUsuario => this.usuario = unUsuario);
      } else {
        this.router.navigate(['inicio']);
      }
    });
  }

  public ingresar(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.login(correo, clave);
  }

  public salir(): Promise<void> {
    return this.auth.logout();
  }

  public usuarioValido(): boolean {
    return this.auth.usuarioValido() && this.usuario !== null && this.usuario !== undefined;
  }

  public traerTodos() {
    return this.afs.collection<Usuario>('usuarios').valueChanges();
  }

  public traerUno(uid: string) {
    return this.afs.doc<Usuario>(`usuarios/${uid}`).valueChanges();
  }

  public alta(usuario: Usuario, clave: string, foto: File): Promise<void> {
    return this.auth.create(usuario.email, clave)
    .then(user => this.procesarAlta(usuario, foto, user));
  }

  private procesarAlta(usuario: Usuario, foto: File, user: firebase.auth.UserCredential): void {
    usuario.providerId = user.user.providerId;
    usuario.uid = user.user.uid;

    user.user.updateProfile({
      displayName: usuario.displayName
    });

    if (foto) {
      const metadata = {
        contentType: 'image/png',
        customMetadata: {
          usuario: usuario.email,
          id: user.user.uid
        }
      };

      const uploadTask = this.storage.upload(
        'avatares/'.concat(this.pipe.transform(new Date(), 'yyyyMMddHHmmssSSS')).concat(foto.name),
        foto,
        metadata
      );

      uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (E) => {},
        () => {
          uploadTask.task.snapshot.ref.getDownloadURL()
          .then((downloadURL) => {
            console.log('File available at', downloadURL);

            // user.user.photoURL = downloadURL;
            user.user.updateProfile({
              photoURL: downloadURL
            });

            usuario.photoURL = downloadURL;
            this.afs.doc<Usuario>(`usuarios/${user.user.uid}`).set(Object.assign({}, usuario), {merge: true});
          });
        });
    }

    this.afs.doc<Usuario>(`usuarios/${user.user.uid}`).set(Object.assign({}, usuario), {merge: true});
}

  public getTipoCliente(): TipoUsuario {
    return TipoUsuario.CLIENTE;
  }

  public getTipoAdmin(): TipoUsuario {
    return TipoUsuario.ADMIN;
  }

  public getTipoRecepcionista(): TipoUsuario {
    return TipoUsuario.RECEPCIONISTA;
  }

  public getTipoEspecialista(): TipoUsuario {
    return TipoUsuario.ESPECIALISTA;
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getTipo(): TipoUsuario {
    return TipoUsuario[this.usuario.tipo];
  }

  public adminCrearUser(usuario: Usuario, clave: string, foto: File): Promise<void> {
    return this.auth.createLogueado(usuario.email, clave)
    .then(user => {
      this.procesarAlta(usuario, foto, user);
      this.auth.logoutLogueado();
    });
  }
}
