import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Consultorio } from '../../clases/consultorio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especialidad } from '../../enums/especialidad.enum';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent implements OnInit {
  @Input() consultorio: Consultorio;
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Consultorio>();
  @Output() errorEvent = new EventEmitter<string>();
  public consultorioForm: FormGroup;
  public enumEsp = Object.values(Especialidad).filter(unTipo => typeof unTipo === 'string');

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.consultorioForm = this.fb.group({
      numero: [this.consultorio.numero, Validators.compose([Validators.required, Validators.min(1)])],
      especialidad: [this.consultorio.especialidad, Validators.compose([Validators.required])]
    });
  }

  public guardar(): void {
    if (this.consultorioForm.valid) {
      this.consultorio.numero = this.consultorioForm.controls.numero.value;
      this.consultorio.especialidad = this.consultorioForm.controls.especialidad.value;
      this.guardarEvent.emit(this.consultorio);
      this.cerrar();
    }
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }

  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'numero':
        if (this.consultorioForm.controls.numero.hasError('required')) {
          retorno = 'Debe ingresar un número de consultorio';
        } else if (this.consultorioForm.controls.numero.hasError('min')) {
          retorno = 'El número de consultorio debe ser mayor que cero';
        } else {
          retorno = 'Error inesperado con el número de consultorio';
        }
        break;
      case 'especialidad':
        if (this.consultorioForm.controls.especialidad.hasError('required')) {
          retorno = 'Debe ingresar una especialidad';
        } else {
          retorno = 'Error inesperado con la especialidad';
        }
        break;
    }

    return retorno;
  }
}
