import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private tipo: string;
  private clave: string;
  private foto: File;

  constructor(
    private usuarios: UsuariosService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tipo = TipoUsuario[this.route.snapshot.paramMap.get('tipo')];
  }

  ngOnInit(): void {
  }

  public registrar(): void {
    if (this.verificarPermisos()) {
      if (this.esAdmin()) {
        this.usuarios.adminCrearUser(this.usuario, this.clave, this.foto)
        .then(() => {
          this.toast.mostrarOk('Registro OK');
          // this.router.navigate(['principal']);
        })
        .catch(error => this.mostrarError(error.code));
      } else {
        this.usuarios.alta(this.usuario, this.clave, this.foto)
        .then(() => {
          this.toast.mostrarOk('Registro OK');
          // this.router.navigate(['principal']);
        })
        .catch(error => this.mostrarError(error.code));
      }
    } else {
      this.toast.mostrarError('No tiene los permisos requeridos para registrar el usuario');
    }
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getTipo(): string {
    return this.tipo;
  }

  public setClave(clave: string): void {
    this.clave = clave;
  }

  public setFoto(unaFoto: File): void {
    this.foto = unaFoto;
  }

  private mostrarError(error: string): void {
    switch (error) {
      case 'auth/email-already-in-use':
        this.toast.mostrarError('Usuario ya registrado');
        break;
      default:
        this.toast.mostrarError();
    }
  }

  private verificarPermisos(): boolean {
    let retorno = true;

    if (this.tipo !== TipoUsuario[this.usuarios.getTipoCliente()]
    && (!this.usuarios.usuarioValido() || this.usuarios.getTipo() !== this.usuarios.getTipoAdmin())) {
      retorno = false;
    }

    return retorno;
  }

  private esAdmin(): boolean {
    return this.usuarios.usuarioValido() && this.usuarios.getTipo() === this.usuarios.getTipoAdmin();
  }

  public usuarioLogueado(): boolean {
    return this.usuarios.usuarioValido();
  }
}
