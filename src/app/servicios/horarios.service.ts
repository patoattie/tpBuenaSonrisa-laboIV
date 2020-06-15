import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Horario } from '../clases/horario';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private afs: AngularFirestore) { }

  public traerTodos() {
    return this.afs.collection<Horario>('horarios').valueChanges();
  }

  public traerUno(uid: string) {
    return this.afs.doc<Horario>(`horarios/${uid}`).valueChanges();
  }

  public nuevo(horario: Horario) {
    return this.afs.collection<Horario>('horarios').add(Object.assign({}, horario))
    .then(call => {
      horario.uid = call.id;
      this.actualizar(horario.uid, horario);
    });
  }

  public actualizar(uid: string, horario: Horario) {
    return this.afs.doc<Horario>(`horarios/${uid}`).set(Object.assign({}, horario), {merge: true});
  }

  public borrar(uid: string) {
    return this.afs.doc<Horario>(`horarios/${uid}`).delete();
  }
}
