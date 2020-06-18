import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Usuario } from '../../clases/usuario';
import { Consultorio } from '../../clases/consultorio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  @Input() turno: Turno;
  @Input() especialista: Usuario;
  @Input() consultorio: Consultorio;
  @Input() puedeGuardar: boolean;
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Turno>();
  public encuestaForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      califClinica: [this.turno.calificacionClinica, Validators.compose([Validators.required])],
      califEspecialista: [this.turno.calificacionEspecialista, Validators.compose([Validators.required])],
      observaciones: [this.turno.observacionesCliente, Validators.compose([])]
    });
  }

  public guardar(): void {
    if (this.encuestaForm.valid) {
      this.turno.calificacionClinica = this.encuestaForm.controls.califClinica.value;
      this.turno.calificacionEspecialista = this.encuestaForm.controls.califEspecialista.value;
      this.turno.observacionesCliente = this.encuestaForm.controls.observaciones.value;
      this.guardarEvent.emit(this.turno);
      this.cerrar();
    }
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }

  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'especialista':
        if (this.encuestaForm.controls.califEspecialista.hasError('required')) {
          retorno = 'Debe ingresar una calificación para el especialista';
        } else {
          retorno = 'Error inesperado con la calificación del especialista';
        }
        break;
      case 'clinica':
        if (this.encuestaForm.controls.califClinica.hasError('required')) {
          retorno = 'Debe ingresar una calificación para la clínica';
        } else {
          retorno = 'Error inesperado con la calificación de la clínica';
        }
        break;
    }

    return retorno;
  }
}
