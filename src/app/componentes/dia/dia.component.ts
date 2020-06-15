import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dia } from '../../clases/dia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.component.html',
  styleUrls: ['./dia.component.css']
})
export class DiaComponent implements OnInit {
  @Input() dia: Dia;
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Dia>();
  @Output() errorEvent = new EventEmitter<string>();
  public diaForm: FormGroup;
  public horas: number[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.horas.push(null);

    for (let index = 0; index < 24; index++) {
      this.horas.push(index);
    }

    this.diaForm = this.fb.group({
      desde: [this.dia.hhDesde, Validators.compose([])],
      hasta: [this.dia.hhHasta, Validators.compose([])]
    });
  }

  public guardar(): void {
    if (typeof this.diaForm.controls.desde.value === 'number' && typeof this.diaForm.controls.hasta.value !== 'number') {
      this.errorEvent.emit('Debe informar hora de cierre');
    } else if (typeof this.diaForm.controls.desde.value !== 'number' && typeof this.diaForm.controls.hasta.value === 'number') {
      this.errorEvent.emit('Debe informar hora de apertura');
    } else if (typeof this.diaForm.controls.desde.value === 'number'
        && typeof this.diaForm.controls.hasta.value === 'number'
        && this.diaForm.controls.desde.value >= this.diaForm.controls.hasta.value) {
      this.errorEvent.emit('La hora de apertura debe ser menor que la de cierre');
    } else { // No hay error
      this.dia.hhDesde = this.diaForm.controls.desde.value;
      this.dia.hhHasta = this.diaForm.controls.hasta.value;
      this.guardarEvent.emit(this.dia);
      this.cerrar();
    }
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }
}
