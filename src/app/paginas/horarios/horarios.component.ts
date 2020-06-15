import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HorariosService } from '../../servicios/horarios.service';
import { DiasService } from '../../servicios/dias.service';
import { ConsultoriosService } from '../../servicios/consultorios.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ToastService } from '../../servicios/toast.service';
import { Horario } from '../../clases/horario';
import { Dia } from '../../clases/dia';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoUsuario } from 'src/app/enums/tipo-usuario.enum';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit, OnDestroy {
  private listaHorarios: Horario[];
  private listaDias: Dia[];
  private listaConsultorios: Consultorio[];
  private listaEspecialistas: Usuario[];
  public columnas: string[] = ['especialista', 'especialidad', 'dia', 'consultorio', 'hhDesde', 'hhHasta', 'turnosPorHora'];
  private desuscribir = new Subject<void>();
  public muestraDetalle = false;
  public fila: Horario;
  private esNuevo: boolean;
  public datos: MatTableDataSource<Horario>;

  constructor(
    private horarios: HorariosService,
    private toast: ToastService,
    private dias: DiasService,
    private consultorios: ConsultoriosService,
    private especialistas: UsuariosService
  ) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.horarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      this.listaHorarios = call;
      this.datos = new MatTableDataSource(this.listaHorarios);
      this.datos.sort = this.sort;
    });

    this.dias.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaDias = call);

    this.consultorios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaConsultorios = call);

    this.especialistas.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaEspecialistas = call.filter(esp => esp.tipo === TipoUsuario[TipoUsuario.ESPECIALISTA]));
  }

  ngOnDestroy(): void {
    this.desuscribir.next();
    this.desuscribir.complete();
  }

  public editarFila(unHorario: Horario): void {
    if (unHorario === null) {
      this.esNuevo = true;
      this.fila = new Horario();
      this.fila.consultorio = null;
      this.fila.dia = null;
      this.fila.especialista = null;
      this.fila.hhDesde = null;
      this.fila.hhHasta = null;
      this.fila.turnosPorHora = null;
      this.fila.uid = null;
    } else {
      this.esNuevo = false;
      this.fila = unHorario;
    }

    this.muestraDetalle = true;
  }

  public cerrarDetalle(): void {
    this.muestraDetalle = false;
  }

  public mostrarError(msj: string): void {
    this.toast.mostrarError(msj);
  }

  public guardar(nuevo: Horario): void {
    if (this.esNuevo && this.listaHorarios.find(
      unHorario => unHorario.consultorio === nuevo.consultorio
        && unHorario.dia === nuevo.dia
        && unHorario.especialista === nuevo.especialista
    ) !== undefined) {
      this.mostrarError('No se puede dar de alta el Horario, ya existe en la lista');
    } else {
      if (this.esNuevo) {
        this.horarios.nuevo(nuevo)
        .then(() => {
          this.toast.mostrarOk('Alta OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      } else {
        this.horarios.actualizar(nuevo.uid, nuevo)
        .then(() => {
          this.toast.mostrarOk('Actualización OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      }
    }
  }

  public getDia(idDia: number): Dia {
    return this.listaDias.find(unDia => unDia.uid === idDia);
  }

  public getConsultorio(idConsultorio: string): Consultorio {
    return this.listaConsultorios.find(unConsultorio => unConsultorio.uid === idConsultorio);
  }

  public getEspecialista(idEspecialista: string): Usuario {
    return this.listaEspecialistas.find(unEspecialista => unEspecialista.uid === idEspecialista);
  }
}
