import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Horario } from '../../clases/horario';
import { Consultorio } from '../../clases/consultorio';
import { Usuario } from '../../clases/usuario';
import { Dia } from '../../clases/dia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  @Input() horario: Horario;
  @Input() dia: Dia;
  @Input() consultorio: Consultorio;
  @Input() especialista: Usuario;
  @Input() dias: Dia[];
  @Input() consultorios: Consultorio[];
  @Input() especialistas: Usuario[];
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Horario>();
  @Output() errorEvent = new EventEmitter<string>();
  public horarioForm: FormGroup;
  public horas: number[] = [];
  public cantHoras: number[] = [1, 2, 4];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    for (let index = 0; index < 24; index++) {
      this.horas.push(index);
    }
    this.horarioForm = this.fb.group({
      especialista: ['', Validators.compose([Validators.required])],
      dia: ['', Validators.compose([Validators.required])],
      consultorio: ['', Validators.compose([Validators.required])],
      desde: [this.horario.hhDesde, Validators.compose([Validators.required])],
      hasta: [this.horario.hhHasta, Validators.compose([Validators.required])],
      cantidad: [this.horario.turnosPorHora, Validators.compose([Validators.required])]
    });

    if (this.especialista) {
      this.horarioForm.controls.especialista.setValue(this.especialista.displayName);
    }

    if (this.dia) {
      this.horarioForm.controls.dia.setValue(this.dia.dia);
    }

    if (this.consultorio) {
      this.horarioForm.controls.consultorio.setValue(this.consultorio.numero);
    }
  }

  public guardar(): void {
    if (this.horarioForm.valid) {
      if (this.horarioForm.controls.desde.value >= this.horarioForm.controls.hasta.value) {
        this.errorEvent.emit('El horario desde debe ser anterior al horario hasta');
      } else {
        this.horario.consultorio = this.consultorios
          .find(unCons => unCons.numero === this.horarioForm.controls.consultorio.value).uid;
        this.horario.dia = this.dias
          .find(unDia => unDia.dia === this.horarioForm.controls.dia.value).uid;
        this.horario.especialista = this.especialistas
          .find(unEsp => unEsp.displayName === this.horarioForm.controls.especialista.value).uid;
        this.horario.hhDesde = this.horarioForm.controls.desde.value;
        this.horario.hhHasta = this.horarioForm.controls.hasta.value;
        this.horario.turnosPorHora = this.horarioForm.controls.cantidad.value;
        this.guardarEvent.emit(this.horario);
        // this.cerrar();
      }
    }
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }

  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'especialista':
        if (this.horarioForm.controls.especialista.hasError('required')) {
          retorno = 'Debe ingresar un especialista';
        } else {
          retorno = 'Error inesperado con el especialista';
        }
        break;
      case 'dia':
        if (this.horarioForm.controls.dia.hasError('required')) {
          retorno = 'Debe ingresar un día de atención';
        } else {
          retorno = 'Error inesperado con el día de atención';
        }
        break;
      case 'consultorio':
        if (this.horarioForm.controls.consultorio.hasError('required')) {
          retorno = 'Debe ingresar un consultorio';
        } else {
          retorno = 'Error inesperado con el consultorio';
        }
        break;
      case 'desde':
        if (this.horarioForm.controls.desde.hasError('required')) {
          retorno = 'Debe ingresar un horario desde';
        } else {
          retorno = 'Error inesperado con el horario desde';
        }
        break;
      case 'hasta':
        if (this.horarioForm.controls.hasta.hasError('required')) {
          retorno = 'Debe ingresar un horario hasta';
        } else {
          retorno = 'Error inesperado con el horario hasta';
        }
        break;
      case 'cantidad':
        if (this.horarioForm.controls.cantidad.hasError('required')) {
          retorno = 'Debe ingresar cantidad de turnos por hora';
        } else {
          retorno = 'Error inesperado con la cantidad de turnos por hora';
        }
        break;
    }

    return retorno;
  }
}
