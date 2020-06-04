import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Login } from '../../clases/login';
import { ToastService } from '../../servicios/toast.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  private usuario = new Login();

  constructor(
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.usuario.correo = 'admin@admin.com';
    this.usuario.clave = '11111111';
  }

  ngOnInit(): void {
  }

  public ingresar() {
    // console.log(this.usuario);
    this.auth.login(this.usuario.correo, this.usuario.clave)
    // .then(user => this.toast.mostrarOk('Hola '.concat(user.user.email)))
    .catch(error => this.mostrarError(error.code));
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

  private mostrarError(error: string): void {
    switch (error) {
      case 'auth/wrong-password':
        this.toast.mostrarError('Usuario o contraseña invalidos');
        break;
      case 'auth/user-not-found':
        this.toast.mostrarError('Usuario o contraseña invalidos');
        break;
      case 'auth/too-many-requests':
        this.toast.mostrarError('Usuario o contraseña invalidos');
        break;
      default:
        this.toast.mostrarError();
    }
  }
}
