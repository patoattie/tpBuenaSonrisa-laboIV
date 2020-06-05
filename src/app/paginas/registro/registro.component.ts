import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../clases/usuario';
import { ToastService } from '../../servicios/toast.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { TipoUsuario } from '../../enums/tipo-usuario.enum';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  private usuario = new Usuario();
  private tipo: TipoUsuario;
  private clave: string;

  constructor(
    private usuarios: UsuariosService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {
    this.tipo = TipoUsuario[this.route.snapshot.paramMap.get('tipo')];
  }

  ngOnInit(): void {
  }

  public registrar(): void {
    this.usuarios.alta(this.usuario, this.clave)
    .catch(error => this.mostrarError(error.code));
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getTipo(): TipoUsuario {
    return this.tipo;
  }

  public setClave(clave: string): void {
    this.clave = clave;
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

  public salir(): void {
    this.usuarios.salir();
  }

  public estaLogueado(): boolean {
    return this.usuarios.usuarioValido();
  }
}
