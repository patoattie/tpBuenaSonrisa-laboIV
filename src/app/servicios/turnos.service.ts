import { Injectable } from '@angular/core';
import { Turno } from '../clases/turno';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private afs: AngularFirestore) { }

  public traerTodos() {
    return this.afs.collection<Turno>('turnos').valueChanges();
  }

  public traerUno(uid: string) {
    return this.afs.doc<Turno>(`turnos/${uid}`).valueChanges();
  }

  public nuevo(turno: Turno) {
    return this.afs.collection<Turno>('turnos').add(Object.assign({}, turno))
    .then(call => {
      turno.uid = call.id;
      this.actualizar(turno.uid, turno);
    });
  }

  public actualizar(uid: string, turno: Turno) {
    return this.afs.doc<Turno>(`turnos/${uid}`).set(Object.assign({}, turno), {merge: true});
  }

  public borrar(uid: string) {
    return this.afs.doc<Turno>(`turnos/${uid}`).delete();
  }
}
