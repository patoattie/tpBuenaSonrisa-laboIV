import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TurnosService } from '../../servicios/turnos.service';
import { HorariosService } from '../../servicios/horarios.service';
import { ConsultoriosService } from '../../servicios/consultorios.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ToastService } from '../../servicios/toast.service';
import { Turno } from '../../clases/turno';
import { Horario } from '../../clases/horario';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TipoUsuario } from 'src/app/enums/tipo-usuario.enum';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {
  private listaTurnos: Turno[];
  private listaConsultorios: Consultorio[];
  private listaEspecialistas: Usuario[];
  private listaClientes: Usuario[];
  private listaHorarios: Horario[];
  public columnas: string[] = ['cliente', 'especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
  private desuscribir = new Subject<void>();
  public muestraDetalle = false;
  public fila: Turno;
  private esNuevo: boolean;
  public datos: MatTableDataSource<Turno>;

  constructor(
    private turnos: TurnosService,
    private toast: ToastService,
    private consultorios: ConsultoriosService,
    private usuarios: UsuariosService,
    private date: DatePipe,
    private horarios: HorariosService
  ) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.turnos.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      this.listaTurnos = call;
      this.datos = new MatTableDataSource(this.listaTurnos);

      this.datos.sortingDataAccessor = (item, header) => {
        switch (header) {
          case 'cliente': return this.getColCliente(item.cliente);
          case 'especialista': return this.getColEspecialista(item.especialista);
          case 'especialidad': return this.getColEspecialidad(item.especialista);
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
        return this.getColCliente(item.cliente).trim().toLowerCase().includes(filtro)
          || this.getColEspecialista(item.especialista).trim().toLowerCase().includes(filtro)
          || this.getColEspecialidad(item.especialista).trim().toLowerCase().includes(filtro)
          || this.getColConsultorio(item.consultorio).trim().toLowerCase().includes(filtro)
          || this.date.transform(item.fecha, 'dd/MM/yyyy').trim().includes(filtro)
          || item.hora.toString().includes(filtro)
          || item.estado.trim().toLowerCase().includes(filtro);
      };

      this.datos.sort = this.sort;
      this.datos.paginator = this.paginator;
    });

    this.consultorios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaConsultorios = call);

    this.horarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaHorarios = call);

    this.usuarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaEspecialistas = call.filter(esp => esp.tipo === TipoUsuario[TipoUsuario.ESPECIALISTA]));

    this.usuarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaClientes = call.filter(esp => esp.tipo === TipoUsuario[TipoUsuario.CLIENTE]));
  }

  ngOnDestroy(): void {
    this.desuscribir.next();
    this.desuscribir.complete();
  }

  public editarFila(unTurno: Turno): void {
    this.fila = new Turno();

    if (unTurno === null) {
      this.esNuevo = true;
      this.fila.cliente = null;
      this.fila.consultorio = null;
      this.fila.especialista = null;
      this.fila.estado = null;
      this.fila.fecha = null;
      this.fila.hora = null;
      this.fila.uid = null;
      this.fila.calificacionClinica = null;
      this.fila.calificacionEspecialista = null;
      this.fila.observacionesCliente = null;
      this.fila.reseña = null;
    } else {
      this.esNuevo = false;
      this.fila.cliente = unTurno.cliente;
      this.fila.consultorio = unTurno.consultorio;
      this.fila.especialista = unTurno.especialista;
      this.fila.estado = unTurno.estado;
      this.fila.fecha = unTurno.fecha;
      this.fila.hora = unTurno.hora;
      this.fila.uid = unTurno.uid;
      this.fila.calificacionClinica = unTurno.calificacionClinica;
      this.fila.calificacionEspecialista = unTurno.calificacionEspecialista;
      this.fila.observacionesCliente = unTurno.observacionesCliente;
      this.fila.reseña = unTurno.reseña;
    }

    this.muestraDetalle = true;
  }

  public cerrarDetalle(): void {
    this.muestraDetalle = false;
  }

  public mostrarError(msj: string): void {
    this.toast.mostrarError(msj);
  }

  public guardar(nuevo: Turno): void {
    if (this.esNuevo && this.listaTurnos.find(
      unTurno => unTurno.consultorio === nuevo.consultorio
        && unTurno.especialista === nuevo.especialista
        && unTurno.cliente === nuevo.cliente
        && unTurno.fecha === nuevo.fecha
        && unTurno.hora === nuevo.hora
    ) !== undefined) {
      this.mostrarError('No se puede dar de alta el Turno, ya existe en la lista');
    } else {
      if (this.esNuevo) {
        this.turnos.nuevo(nuevo)
        .then(() => {
          this.toast.mostrarOk('Alta OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      } else {
        this.turnos.actualizar(nuevo.uid, nuevo)
        .then(() => {
          this.toast.mostrarOk('Actualización OK');
          this.cerrarDetalle();
        })
        .catch(e => console.log(e));
      }
    }
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

  public getCliente(idCliente: string): Usuario {
    return this.listaClientes ? this.listaClientes.find(unCliente => unCliente.uid === idCliente) : null;
  }

  public getColEspecialista(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.displayName : '';
  }

  public getColCliente(idCliente: string): string {
    const esp = this.getCliente(idCliente);
    return esp ? esp.displayName : '';
  }

  public getColEspecialidad(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.especialidad : '';
  }

  public getConsultorios(): Consultorio[] {
    return this.listaConsultorios.sort((a, b) => a.numero - b.numero);
  }

  public getEspecialistas(): Usuario[] {
    return this.listaEspecialistas.sort((a, b) => a.displayName < b.displayName ? -1 : 1);
  }

  public getClientes(): Usuario[] {
    return this.listaClientes.sort((a, b) => a.displayName < b.displayName ? -1 : 1);
  }

  public getHorarios(): Horario[] {
    return this.listaHorarios;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filter = filterValue.trim().toLowerCase();
  }
}
