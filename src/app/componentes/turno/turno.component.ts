import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  @Input() turno: Turno;
  @Input() consultorio: Consultorio;
  @Input() cliente: Usuario;
  @Input() especialista: Usuario;
  @Input() horarios: Horario[];
  @Input() consultorios: Consultorio[];
  @Input() clientes: Usuario[];
  @Input() especialistas: Usuario[];
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Turno>();
  @Output() errorEvent = new EventEmitter<string>();
  public turnoForm: FormGroup;
  private turnosDisponibles: Turno[] = [];
  public datos: MatTableDataSource<Turno>;
  public columnas: string[] = ['especialista', 'especialidad', 'consultorio', 'fecha', 'hora', 'estado'];
  public fila: Turno;

  constructor(
    private fb: FormBuilder,
    private date: DatePipe,
    private numHora: NumHoraPipe,
    private changeDet: ChangeDetectorRef
  ) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public filtroFecha = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const hoy = new Date();
    return this.horarios ? d >= hoy && this.horarios.find(unHorario => unHorario.dia === day) !== undefined : true;
  }

  ngOnInit(): void {
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.compose([Validators.required])],
      fecha: ['', Validators.compose([Validators.required])],
    });

    this.turnoForm.controls.fecha.setValue(this.turno.fecha || new Date());
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
    if (this.turnoForm.valid) {
      this.turno.consultorio = this.consultorios
        .find(unCons => unCons.numero === this.turnoForm.controls.consultorio.value).uid;
      this.turno.especialista = this.especialistas
        .find(unEsp => unEsp.displayName === this.turnoForm.controls.especialista.value).uid;
      /*this.turno.hhDesde = this.turnoForm.controls.desde.value;
      this.turno.hhHasta = this.turnoForm.controls.hasta.value;
      this.turno.turnosPorHora = this.turnoForm.controls.cantidad.value;*/
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
    }

    return retorno;
  }

  public setTurnosDisponibles(fecha: Date | MatDatepickerInputEvent<Date>): void {
    // Vacío array
    while (this.turnosDisponibles.length > 0) {
      this.turnosDisponibles.pop();
    }

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
        this.turnosDisponibles.push(nuevoTurno);
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
}
