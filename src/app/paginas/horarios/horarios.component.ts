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
import { MatPaginator } from '@angular/material/paginator';
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

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.horarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      this.listaHorarios = call;
      this.datos = new MatTableDataSource(this.listaHorarios);

      this.datos.sortingDataAccessor = (item, header) => {
        switch (header) {
          case 'especialista': return this.getColEspecialista(item.especialista);
          case 'especialidad': return this.getColEspecialidad(item.especialista);
          case 'dia': return this.getColDia(item.dia);
          case 'consultorio': return this.getColConsultorio(item.consultorio);
          default: return item[header];
        }
      };
      this.sort.active = 'especialista';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit({
        active: this.sort.active,
        direction: this.sort.direction
      });
      this.sort.sort(this.sort.sortables.get('especialista'));

      this.datos.filterPredicate = (item, filtro) => {
        return this.getColEspecialista(item.especialista).trim().toLowerCase().includes(filtro)
          || this.getColEspecialidad(item.especialista).trim().toLowerCase().includes(filtro)
          || this.getColDia(item.dia).trim().toLowerCase().includes(filtro)
          || this.getColConsultorio(item.consultorio).trim().toLowerCase().includes(filtro)
          || item.hhDesde.toString().includes(filtro)
          || item.hhHasta.toString().includes(filtro)
          || item.turnosPorHora.toString().includes(filtro);
      };

      this.datos.sort = this.sort;
      this.datos.paginator = this.paginator;
    // this.datos.sort.sort(this.sort.sortables.get('especialista'));
    });

    this.dias.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaDias = call.filter(unDia => unDia.hhDesde !== null));

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
    this.fila = new Horario();

    if (unHorario === null) {
      this.esNuevo = true;
      // this.fila = new Horario();
      this.fila.consultorio = null;
      this.fila.dia = null;
      this.fila.especialista = null;
      this.fila.hhDesde = null;
      this.fila.hhHasta = null;
      this.fila.turnosPorHora = null;
      this.fila.uid = null;
    } else {
      this.esNuevo = false;
      // this.fila = unHorario;
      this.fila.consultorio = unHorario.consultorio;
      this.fila.dia = unHorario.dia;
      this.fila.especialista = unHorario.especialista;
      this.fila.hhDesde = unHorario.hhDesde;
      this.fila.hhHasta = unHorario.hhHasta;
      this.fila.turnosPorHora = unHorario.turnosPorHora;
      this.fila.uid = unHorario.uid;
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
    if (this.validarDia(nuevo) && this.validarEspecialidad(nuevo)) {
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
  }

  private validarDia(nuevo: Horario): boolean {
    const dia = this.getDia(nuevo.dia);
    const validacion = dia.hhDesde !== null && nuevo.hhDesde >= dia.hhDesde && nuevo.hhHasta <= dia.hhHasta;

    if (!validacion) {
      this.mostrarError('El horario ingresado no respeta las horas de apertura y cierre');
    }

    return validacion;
  }

  private validarEspecialidad(nuevo: Horario): boolean {
    const consultorio = this.getConsultorio(nuevo.consultorio);
    const especialista = this.getEspecialista(nuevo.especialista);
    const validacion = consultorio.especialidad === especialista.especialidad;

    if (!validacion) {
      this.mostrarError('El consultorio no es apto para el especialista');
    }

    return validacion;
  }

  public getDia(idDia: number): Dia {
    return this.listaDias ? this.listaDias.find(unDia => unDia.uid === idDia) : null;
  }

  public getColDia(idDia: number): string {
    const d = this.getDia(idDia);
    return d ? d.dia : '';
  }

  public getConsultorio(idConsultorio: string): Consultorio {
    return this.listaConsultorios ? this.listaConsultorios.find(unConsultorio => unConsultorio.uid === idConsultorio) : null;
  }

  public getColConsultorio(idConsultorio: string): string {
    const con = this.getConsultorio(idConsultorio);
    return con ? con.numero.toString() : '';
  }

  public getEspecialista(idEspecialista: string): Usuario {
    return this.listaEspecialistas ? this.listaEspecialistas.find(unEspecialista => unEspecialista.uid === idEspecialista) : null;
  }

  public getColEspecialista(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.displayName : '';
  }

  public getColEspecialidad(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.especialidad : '';
  }

  public getDias(): Dia[] {
    return this.listaDias.sort((a, b) => a.uid - b.uid);
  }

  public getConsultorios(): Consultorio[] {
    return this.listaConsultorios.sort((a, b) => a.numero - b.numero);
  }

  public getEspecialistas(): Usuario[] {
    return this.listaEspecialistas.sort((a, b) => a.displayName < b.displayName ? -1 : 1);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filter = filterValue.trim().toLowerCase();
  }
}
