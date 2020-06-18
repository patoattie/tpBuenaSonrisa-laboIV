import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Usuario } from '../../clases/usuario';
import { Consultorio } from '../../clases/consultorio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resenia',
  templateUrl: './resenia.component.html',
  styleUrls: ['./resenia.component.css']
})
export class ReseniaComponent implements OnInit {
  @Input() turno: Turno;
  @Input() cliente: Usuario;
  @Input() consultorio: Consultorio;
  @Output() cerrarEvent = new EventEmitter<void>();
  @Output() guardarEvent = new EventEmitter<Turno>();
  public reseniaForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reseniaForm = this.fb.group({
      resenia: [this.turno.reseña, Validators.compose([])]
    });
  }

  public guardar(): void {
    this.turno.reseña = this.reseniaForm.controls.resenia.value;
    this.guardarEvent.emit(this.turno);
    this.cerrar();
  }

  public cerrar(): void {
    this.cerrarEvent.emit();
  }
}
