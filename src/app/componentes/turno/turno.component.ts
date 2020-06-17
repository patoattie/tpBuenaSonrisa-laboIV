import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NumHoraPipe } from '../../pipes/num-hora.pipe';
import { Turno } from '../../clases/turno';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Horario } from '../../clases/horario';
import { EstadoTurno } from '../../enums/estado-turno.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {
  @Input() turnos: Turno[];
  @Input() horarios: Horario[];
  @Input() consultorios: Consultorio[];
  @Input() clientes: Usuario[];
  @Input() especialistas: Usuario[];
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Turno>();
  @Output() errorEvent = new EventEmitter<string>();
  private turno: Turno;
  public turnoForm: FormGroup;
  private turnosDisponibles: Turno[] = [];
  public datos: MatTableDataSource<Turno>;
  public columnas: string[] = ['especialista', 'especialidad', 'consultorio', 'fecha', 'hora'];

  constructor(
    private fb: FormBuilder,
    private date: DatePipe,
    private numHora: NumHoraPipe
  ) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public filtroFecha = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const hoy = new Date();
    return this.horarios ? d >= hoy && this.horarios.find(unHorario => unHorario.dia === day) !== undefined : true;
  }

  ngOnInit(): void {
    const hoy = new Date();
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.compose([Validators.required])],
      fecha: ['', Validators.compose([Validators.required])],
      especialista: ['', Validators.compose([Validators.required])],
      consultorio: ['', Validators.compose([Validators.required])],
      hora: ['', Validators.compose([Validators.required])],
    });

    this.turnoForm.controls.fecha.setValue(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));
    this.setTurnosDisponibles(this.turnoForm.controls.fecha.value);
    this.datos = new MatTableDataSource(this.turnosDisponibles);

    this.datos.sortingDataAccessor = (item, header) => {
      switch (header) {
        case 'especialista': return this.getColEspecialista(item.especialista);
        case 'especialidad': return this.getColEspecialidad(item.especialista);
        case 'consultorio': return this.getColConsultorio(item.consultorio);
        default: return item[header];
      }
    };
    /*this.sort.active = 'especialista';
    this.sort.direction = 'asc';
    this.sort.sortChange.emit({
      active: this.sort.active,
      direction: this.sort.direction
    });
    this.sort.sort(this.sort.sortables.get('especialista'));*/

    this.datos.filterPredicate = (item, filtro) => {
      return this.getColEspecialista(item.especialista).trim().toLowerCase().includes(filtro)
        || this.getColEspecialidad(item.especialista).trim().toLowerCase().includes(filtro)
        || this.getColConsultorio(item.consultorio).trim().toLowerCase().includes(filtro)
        || this.date.transform(item.fecha, 'dd/MM/yyyy').trim().includes(filtro)
        || this.numHora.transform(item.hora).trim().includes(filtro)
        || item.estado.trim().toLowerCase().includes(filtro);
    };

    this.datos.sort = this.sort;
    this.datos.paginator = this.paginator;
}

  public guardar(): void {
// console.log(this.turnoForm.controls);
// console.log(this.consultorios);
    if (this.turnoForm.valid) {
      this.turno = new Turno();

      this.turno.cliente = this.clientes
        .find(unCli => unCli.displayName === this.turnoForm.controls.cliente.value).uid;
      this.turno.consultorio = this.consultorios
        .find(unCons => unCons.numero.toString() === this.turnoForm.controls.consultorio.value).uid;
      this.turno.especialista = this.especialistas
        .find(unEsp => unEsp.displayName === this.turnoForm.controls.especialista.value).uid;
      this.turno.estado = EstadoTurno[EstadoTurno.PENDIENTE];
      this.turno.fecha = this.turnoForm.controls.fecha.value;
      this.turno.hora = this.turnoForm.controls.hora.value;
      this.guardarEvent.emit(this.turno);
      // this.cerrar();
    }
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }

  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'cliente':
        if (this.turnoForm.controls.cliente.hasError('required')) {
          retorno = 'Debe ingresar un cliente';
        } else {
          retorno = 'Error inesperado con el cliente';
        }
        break;
      case 'fecha':
        if (this.turnoForm.controls.fecha.hasError('required')) {
          retorno = 'Debe ingresar una fecha';
        } else {
          retorno = 'Error inesperado con la fecha';
        }
        break;
      case 'especialista':
        if (this.turnoForm.controls.especialista.hasError('required')) {
          retorno = 'Debe ingresar un especialista';
        } else {
          retorno = 'Error inesperado con el especialista';
        }
        break;
      case 'consultorio':
        if (this.turnoForm.controls.consultorio.hasError('required')) {
          retorno = 'Debe ingresar un consultorio';
        } else {
          retorno = 'Error inesperado con el consultorio';
        }
        break;
      case 'hora':
        if (this.turnoForm.controls.hora.hasError('required')) {
          retorno = 'Debe ingresar una hora';
        } else {
          retorno = 'Error inesperado con la hora';
        }
        break;
    }

    return retorno;
  }

  public setTurnosDisponibles(fecha: Date | MatDatepickerInputEvent<Date>): void {
    // Vacío array
    while (this.turnosDisponibles.length > 0) {
      this.turnosDisponibles.pop();
    }

    // Limpio inputs
    this.turnoForm.controls.especialista.setValue('');
    this.turnoForm.controls.consultorio.setValue('');
    this.turnoForm.controls.hora.setValue('');

    this.horarios
    .filter(call => call.dia === (fecha instanceof Date ? fecha.getDay() : fecha.value.getDay()))
    .forEach(call2 => {
      for (let index = call2.hhDesde; index <= call2.hhHasta; index = index + (1 / call2.turnosPorHora)) {
        const nuevoTurno = new Turno();
        nuevoTurno.cliente = null; // this.cliente.uid;
        nuevoTurno.consultorio = call2.consultorio;
        nuevoTurno.especialista = call2.especialista;
        nuevoTurno.estado = EstadoTurno[EstadoTurno.PENDIENTE];
        nuevoTurno.fecha = (fecha instanceof Date ? fecha : fecha.value);
        nuevoTurno.hora = index;
        nuevoTurno.uid = null;

        // Si no está otorgado el turno lo agrego como disponible
        if (!this.existeTurno(nuevoTurno)) {
          this.turnosDisponibles.push(nuevoTurno);
        }
      }
    });
console.log(this.turnosDisponibles);

    // Para refrescar la tabla cuando cambio el filtro de fecha
    if (this.datos) {
      this.datos.filter = this.datos.filter;
    }
    // this.datos = new MatTableDataSource(this.turnosDisponibles);
  }

  public getConsultorio(idConsultorio: string): Consultorio {
    return this.consultorios ? this.consultorios.find(unConsultorio => unConsultorio.uid === idConsultorio) : null;
  }

  public getColConsultorio(idConsultorio: string): string {
    const con = this.getConsultorio(idConsultorio);
    return con ? con.numero.toString() : '';
  }

  public getEspecialista(idEspecialista: string): Usuario {
    return this.especialistas ? this.especialistas.find(unEspecialista => unEspecialista.uid === idEspecialista) : null;
  }

  public getColEspecialista(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.displayName : '';
  }

  public getColEspecialidad(idEspecialista: string): string {
    const esp = this.getEspecialista(idEspecialista);
    return esp ? esp.especialidad : '';
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filter = filterValue.trim().toLowerCase();
  }

  public editarFila(unTurno: Turno): void {
    this.turnoForm.controls.consultorio.setValue(this.getColConsultorio(unTurno.consultorio));
    this.turnoForm.controls.especialista.setValue(this.getColEspecialista(unTurno.especialista));
    this.turnoForm.controls.hora.setValue(unTurno.hora);
  }

  private existeTurno(turno: Turno): boolean {
    // En firestore los objetos de tipo Date se guardan como Timestamp
    // con lo cual para comparar se toma el atributo seconds del Timestamp
    // multimplicado por 1000 comparado contra el método getTime() de Date.
    return this.turnos.find(unTurno =>
      unTurno.especialista === turno.especialista
      && unTurno.estado === EstadoTurno[EstadoTurno.PENDIENTE]
      && unTurno.fecha.seconds * 1000 === turno.fecha.getTime()
      && unTurno.hora === turno.hora) !== undefined;
  }
}
