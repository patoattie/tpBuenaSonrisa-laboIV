import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../clases/login';
import { ToastService } from '../../servicios/toast.service';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  private usuario = new Login();

  constructor(
    private usuarios: UsuariosService,
    private toast: ToastService,
    private router: Router
  ) {
    this.usuario.correo = 'admin@admin.com';
    this.usuario.clave = '11111111';
    // this.usuario.correo = 'pepe@pepe.com';
    // this.usuario.clave = '123123';
  }

  ngOnInit(): void {
  }

  public ingresar() {
    // console.log(this.usuario);
    this.usuarios.ingresar(this.usuario.correo, this.usuario.clave)
    .then(user => {
      this.toast.mostrarOk('Hola '.concat(user.user.displayName));
      // this.router.navigate(['principal']);
    })
    .catch(error => this.mostrarError(error.code));
  }

  public getUsuario(): Login {
    return this.usuario;
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
