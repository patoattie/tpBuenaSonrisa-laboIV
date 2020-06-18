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
import { TipoUsuario } from '../../enums/tipo-usuario.enum';
import { EstadoTurno } from '../../enums/estado-turno.enum';

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
  public columnas: string[]; // = ['cliente', 'especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
  private desuscribir = new Subject<void>();
  public muestraDetalle = false;
  public muestraResenia = false;
  public muestraEncuesta = false;
  public fila: Turno;
  private esNuevo: boolean;
  public datos: MatTableDataSource<Turno>;
  private perfil: TipoUsuario;
  private usuarioLogueado: Usuario;

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
    this.usuarioLogueado = this.usuarios.getUsuario();
    this.perfil = this.usuarios.getTipo(); // Perfil del usuario logueado
    this.columnas = this.getColumnas(this.perfil); // Columnas de la tabla según perfil

    this.turnos.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      this.listaTurnos = call;

      // Si el usuario es un Cliente, sólo puede ver sus propios turnos pedidos
      if (this.perfil === this.usuarios.getTipoCliente()) {
        this.datos = new MatTableDataSource(this.listaTurnos.filter(c2 => c2.cliente === this.usuarioLogueado.uid));
      // Si el usuario es un Especialista, sólo puede ver sus propios turnos asignados
      } else if (this.perfil === this.usuarios.getTipoEspecialista()) {
        this.datos = new MatTableDataSource(this.listaTurnos.filter(c2 => c2.especialista === this.usuarioLogueado.uid));
      // Si el usuario es un Recepcionista, puede ver todos los turnos
      } else {
        this.datos = new MatTableDataSource(this.listaTurnos);
      }

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
    .subscribe(call => this.listaEspecialistas = call.filter(esp => esp.tipo === TipoUsuario[this.usuarios.getTipoEspecialista()]));

    this.usuarios.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => this.listaClientes = call.filter(esp => esp.tipo === TipoUsuario[this.usuarios.getTipoCliente()]));
  }

  ngOnDestroy(): void {
    this.desuscribir.next();
    this.desuscribir.complete();
  }

  public editarFila(unTurno: Turno): void {
    if (!this.muestraDetalle && !this.muestraResenia && !this.muestraEncuesta) {
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
        this.fila.calificacionClinica = unTurno.calificacionClinica || null;
        this.fila.calificacionEspecialista = unTurno.calificacionEspecialista || null;
        this.fila.observacionesCliente = unTurno.observacionesCliente || null;
        this.fila.reseña = unTurno.reseña || null;
      }

      // Si el turno está atendido no se muestra detalle y en cambio
      // habilito el botón de ver Reseña o Encuesta según corresponda
      if (!(unTurno && unTurno.estado === EstadoTurno[EstadoTurno.ATENDIDO])) {
        /*if (this.puedeVerResenia()) {
          this.muestraResenia = true;
        }

        if (this.puedeVerEncuesta()) {
          this.muestraEncuesta = true;
        }
      } else {*/
        this.muestraDetalle = true;
      }
    }
  }

  public cerrarDetalle(): void {
    if (this.muestraDetalle) {
      this.muestraDetalle = false;
    } else if (this.muestraResenia) {
      this.muestraResenia = false;
    } else if (this.muestraEncuesta) {
      this.muestraEncuesta = false;
    }
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
        && unTurno.estado === EstadoTurno[EstadoTurno.PENDIENTE]
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

  public cancelar(turno: Turno): void {
    this.turnos.actualizar(turno.uid, turno)
    .then(() => {
      this.toast.mostrarOk('Turno Cancelado');
      this.cerrarDetalle();
    })
    .catch(e => console.log(e));
  }

  public atender(turno: Turno): void {
    this.turnos.actualizar(turno.uid, turno)
    .then(() => {
      this.toast.mostrarOk('Turno Atendido');
      this.cerrarDetalle();
    })
    .catch(e => console.log(e));
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
    return this.listaHorarios || [];
  }

  public getTurnos(): Turno[] {
    return this.listaTurnos || [];
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filter = filterValue.trim().toLowerCase();
  }

  private getColumnas(perfil: TipoUsuario): string[] {
    let retorno: string[];

    switch (perfil) {
      case this.usuarios.getTipoCliente():
        retorno = ['especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
        break;
      case this.usuarios.getTipoEspecialista():
        retorno = ['cliente', 'especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
        break;
      case this.usuarios.getTipoRecepcionista():
        retorno = ['cliente', 'especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
        break;
      default:
        retorno = [];
    }

    return retorno;
  }

  public getPerfil(): TipoUsuario {
    return this.perfil;
  }

  public getUsuarioLogueado(): Usuario {
    return this.usuarioLogueado;
  }

  public getPuedeVerCliente(): boolean {
    return this.usuarioLogueado ? this.usuarioLogueado.tipo !== TipoUsuario[this.usuarios.getTipoCliente()] : false;
  }

  public getPuedeSacarTurno(): boolean {
    return this.usuarioLogueado ? this.usuarioLogueado.tipo !== TipoUsuario[this.usuarios.getTipoEspecialista()] : false;
  }

  public getPuedeAtender(): boolean {
    return this.usuarioLogueado ? this.usuarioLogueado.tipo === TipoUsuario[this.usuarios.getTipoEspecialista()] : false;
  }

  public puedeVerResenia(): boolean {
    return (this.usuarioLogueado
    ? this.usuarioLogueado.tipo === TipoUsuario[this.usuarios.getTipoEspecialista()]
      || this.usuarioLogueado.tipo === TipoUsuario[this.usuarios.getTipoCliente()]
    : false) && (this.fila ? this.fila.estado === EstadoTurno[EstadoTurno.ATENDIDO] : false);
  }

  public puedeVerEncuesta(): boolean {
    return (this.usuarioLogueado
    ? this.usuarioLogueado.tipo === TipoUsuario[this.usuarios.getTipoCliente()]
    : false) && (this.fila ? this.fila.estado === EstadoTurno[EstadoTurno.ATENDIDO] : false);
  }
}
