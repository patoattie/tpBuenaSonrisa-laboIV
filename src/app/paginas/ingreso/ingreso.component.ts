import { Component, OnInit } from '@angular/core';
import { Login } from '../../clases/login';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  usuario = new Login();

  constructor() {
    this.usuario.correo = '';
    this.usuario.clave = '';
  }

  ngOnInit(): void {
  }

  public ingresar() {
    console.log(this.usuario);
  }
}
