import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UsuariosService } from '../../servicios/usuarios.service';
import { NavegacionService } from '../../servicios/navegacion.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private location: Location,
    private usuarios: UsuariosService,
    private navega: NavegacionService
  ) { }

  ngOnInit(): void { }

  public irAtras(): void {
    if (this.puedeIrAtras()) {
      this.location.back();
    }
  }

  public puedeIrAtras(): boolean {
    return this.location.path() !== '/inicio' && this.location.path() !== '/principal';
  }

  public usuarioLogueado(): boolean {
    return this.usuarios.usuarioValido();
  }

  public getTipoCliente() {
    return this.usuarios.getTipoCliente();
  }

  public getTipoAdmin() {
    return this.usuarios.getTipoAdmin();
  }

  public getTipoRecepcionista() {
    return this.usuarios.getTipoRecepcionista();
  }

  public getTipoEspecialista() {
    return this.usuarios.getTipoEspecialista();
  }

  public getTipoUsuario() {
    return this.usuarios.getTipo();
  }

  public getImagen(): string {
    const usuario = this.usuarios.getUsuario();
    let retorno = '../../../assets/avatar.png';

    if (usuario && usuario.photoURL.length > 0) {
      retorno = usuario.photoURL;
    }

    return retorno;
  }

  public getNombre(): string {
    const usuario = this.usuarios.getUsuario();
    let retorno = 'NN';

    if (usuario) {
      if (usuario.displayName.length > 0) {
        retorno = usuario.displayName;
      } else {
        retorno = usuario.email;
      }
    }

    return this.usuarios.getUsuario() ? this.usuarios.getUsuario().displayName : '';
  }

  public salir(): void {
    this.usuarios.salir();
  }

  public navegar(ruta: string): void {
    this.navega.navegar(ruta);
  }
}
