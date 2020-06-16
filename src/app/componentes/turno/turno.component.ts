import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Dia } from '../../clases/dia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {
  @Input() turno: Turno;
  @Input() dia: Dia;
  @Input() consultorio: Consultorio;
  @Input() cliente: Usuario;
  @Input() especialista: Usuario;
  @Input() dias: Dia[];
  @Input() consultorios: Consultorio[];
  @Input() clientes: Usuario[];
  @Input() especialistas: Usuario[];
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Turno>();
  @Output() errorEvent = new EventEmitter<string>();
  public turnoForm: FormGroup;
  public horas: number[] = [];
  public cantHoras: number[] = [1, 2, 4];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    for (let index = 0; index < 24; index++) {
      this.horas.push(index);
    }
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.compose([Validators.required])],
      fecha: [this.turno.fecha, Validators.compose([Validators.required])],
    });
  }

  public guardar(): void {
    if (this.turnoForm.valid) {
      this.turno.consultorio = this.consultorios
        .find(unCons => unCons.numero === this.turnoForm.controls.consultorio.value).uid;
      this.turno.dia = this.dias
        .find(unDia => unDia.dia === this.turnoForm.controls.dia.value).uid;
      this.turno.especialista = this.especialistas
        .find(unEsp => unEsp.displayName === this.turnoForm.controls.especialista.value).uid;
      this.turno.hhDesde = this.turnoForm.controls.desde.value;
      this.turno.hhHasta = this.turnoForm.controls.hasta.value;
      this.turno.turnosPorHora = this.turnoForm.controls.cantidad.value;
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
      case 'especialista':
        if (this.turnoForm.controls.especialista.hasError('required')) {
          retorno = 'Debe ingresar un especialista';
        } else {
          retorno = 'Error inesperado con el especialista';
        }
        break;
      case 'dia':
        if (this.turnoForm.controls.dia.hasError('required')) {
          retorno = 'Debe ingresar un día de atención';
        } else {
          retorno = 'Error inesperado con el día de atención';
        }
        break;
      case 'consultorio':
        if (this.turnoForm.controls.consultorio.hasError('required')) {
          retorno = 'Debe ingresar un consultorio';
        } else {
          retorno = 'Error inesperado con el consultorio';
        }
        break;
      case 'desde':
        if (this.turnoForm.controls.desde.hasError('required')) {
          retorno = 'Debe ingresar un turno desde';
        } else {
          retorno = 'Error inesperado con el turno desde';
        }
        break;
      case 'hasta':
        if (this.turnoForm.controls.hasta.hasError('required')) {
          retorno = 'Debe ingresar un turno hasta';
        } else {
          retorno = 'Error inesperado con el turno hasta';
        }
        break;
      case 'cantidad':
        if (this.turnoForm.controls.cantidad.hasError('required')) {
          retorno = 'Debe ingresar cantidad de turnos por hora';
        } else {
          retorno = 'Error inesperado con la cantidad de turnos por hora';
        }
        break;
    }

    return retorno;
  }
}
