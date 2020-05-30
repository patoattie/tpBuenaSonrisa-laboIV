import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void { }

  /*public ingresar(usuario: any) {
    console.log(usuario);
    console.log(this.jwt.decodeToken(usuario.xa));
  }*/

  public salir() {
    this.auth.logout();
  }

  public mostrarError(error: any) {
    switch (error.code) {
      case 'auth/wrong-password':
        console.log('Usuario o contraseña invalidos');
        break;
      case 'auth/user-not-found':
        console.log('Usuario o contraseña invalidos');
        break;
      default:
        console.log('ERROR: ', error);
    }
  }

  public estaLogueado(): boolean {
    return this.auth.usuarioValido();
  }
}
