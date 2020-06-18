import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { NavegacionService } from '../../servicios/navegacion.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(
    private usuarios: UsuariosService,
    private navega: NavegacionService
  ) { }

  ngOnInit(): void {
  }

  public getUsuario(): Usuario {
    return this.usuarios.getUsuario();
  }

  public navegar(ruta: string): void {
    this.navega.navegar(ruta);
  }

  public getTipoAdmin() {
    return this.usuarios.getTipoAdmin();
  }

  public getTipoUsuario() {
    return this.usuarios.getTipo();
  }
}
