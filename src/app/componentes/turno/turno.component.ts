import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Horario } from '../../clases/horario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public filtroFecha = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const hoy = new Date();
    return this.horarios ? d >= hoy && this.horarios.find(unHorario => unHorario.dia === day) !== undefined : true;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.turnoForm = this.fb.group({
      cliente: ['', Validators.compose([Validators.required])],
      fecha: ['', Validators.compose([Validators.required])],
    });

    this.turnoForm.controls.fecha.setValue(this.turno.fecha ? this.turno.fecha : new Date());
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
}
