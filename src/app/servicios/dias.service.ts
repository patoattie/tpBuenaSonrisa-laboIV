import { Injectable } from '@angular/core';
import { Dias } from '../enums/dias.enum';
import { Dia } from '../clases/dia';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiasService {

  constructor(private afs: AngularFirestore) { }

  public traerTodos() {
    return this.afs.collection<Dia>('dias').valueChanges();
  }

  public traerUno(uid: Dias) {
    return this.afs.doc<Dia>(`dias/${uid}`).valueChanges();
  }

  public actualizar(uid: Dias, dia: Dia) {
    return this.afs.doc<Dia>(`dias/${uid}`).set(Object.assign({}, dia), {merge: true});
  }

  public borrar(uid: Dias) {
    return this.afs.doc<Dia>(`dias/${uid}`).delete();
  }
}
