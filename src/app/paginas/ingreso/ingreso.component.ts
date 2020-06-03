import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Login } from '../../clases/login';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  private usuario = new Login();

  constructor(
    private auth: AuthService
  ) {
    this.usuario.correo = 'admin@admin.com';
    this.usuario.clave = '11111111';
  }

  ngOnInit(): void {
  }

  public ingresar() {
    // console.log(this.usuario);
    this.auth.login(this.usuario.correo, this.usuario.clave);
  }

  public getUsuario(): Login {
    return this.usuario;
  }

  public salir() {
    this.auth.logout();
  }

  public estaLogueado(): boolean {
    return this.auth.usuarioValido();
  }
}
