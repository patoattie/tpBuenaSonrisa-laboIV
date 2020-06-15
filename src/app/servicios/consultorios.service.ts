import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Consultorio } from '../clases/consultorio';

@Injectable({
  providedIn: 'root'
})
export class ConsultoriosService {

  constructor(private afs: AngularFirestore) { }

  public traerTodos() {
    return this.afs.collection<Consultorio>('consultorios').valueChanges();
  }

  public traerUno(uid: string) {
    return this.afs.doc<Consultorio>(`consultorios/${uid}`).valueChanges();
  }

  public nuevo(consultorio: Consultorio) {
    return this.afs.collection<Consultorio>('consultorios').add(Object.assign({}, consultorio))
    .then(call => {
      consultorio.uid = call.id;
      this.actualizar(consultorio.uid, consultorio);
    });
  }

  public actualizar(uid: string, consultorio: Consultorio) {
    return this.afs.doc<Consultorio>(`consultorios/${uid}`).set(Object.assign({}, consultorio), {merge: true});
  }

  public borrar(uid: string) {
    return this.afs.doc<Consultorio>(`consultorios/${uid}`).delete();
  }
}
