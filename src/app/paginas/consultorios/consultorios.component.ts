import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConsultoriosService } from '../../servicios/consultorios.service';
import { ToastService } from '../../servicios/toast.service';
import { Consultorio } from '../../clases/consultorio';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-consultorios',
  templateUrl: './consultorios.component.html',
  styleUrls: ['./consultorios.component.css']
})
export class ConsultoriosComponent implements OnInit, OnDestroy {
  private listaConsultorios: Consultorio[];
  public columnas: string[] = ['numero', 'especialidad'];
  private desuscribir = new Subject<void>();
  public muestraDetalle = false;
  public fila: Consultorio;
  private esNuevo: boolean;
  public datos: MatTableDataSource<Consultorio>;

  constructor(
    private consultorios: ConsultoriosService,
    private toast: ToastService
  ) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.consultorios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      this.listaConsultorios = call;
      this.datos = new MatTableDataSource(this.listaConsultorios);
      this.datos.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.desuscribir.next();
    this.desuscribir.complete();
  }

  /*public getListado(): Consultorio[] {
    return this.listaConsultorios;
  }*/

  public editarFila(unConsultorio: Consultorio): void {
    if (unConsultorio === null) {
      this.esNuevo = true;
      this.fila = new Consultorio();
      this.fila.especialidad = null;
      this.fila.numero = null;
      this.fila.uid = null;
    } else {
      this.esNuevo = false;
      this.fila = unConsultorio;
    }

    this.muestraDetalle = true;
  }

  public cerrarDetalle(): void {
    this.muestraDetalle = false;
  }

  public mostrarError(msj: string): void {
    this.toast.mostrarError(msj);
  }

  public guardar(nuevo: Consultorio): void {
    if (this.esNuevo && this.listaConsultorios.find(unConsultorio => unConsultorio.numero === nuevo.numero) !== undefined) {
      this.mostrarError('No se puede dar de alta el Consultorio, ya existe en la lista');
    } else {
      if (this.esNuevo) {
        this.consultorios.nuevo(nuevo)
        .then(() => {
          this.toast.mostrarOk('Alta OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      } else {
        this.consultorios.actualizar(nuevo.uid, nuevo)
        .then(() => {
          this.toast.mostrarOk('Actualización OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      }
    }
  }
}
