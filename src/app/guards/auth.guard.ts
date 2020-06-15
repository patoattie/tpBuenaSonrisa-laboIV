import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';
import { NavegacionService } from '../servicios/navegacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarios: UsuariosService,
    private navega: NavegacionService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let retorno = true;

    if (!this.usuarios.usuarioValido()) {
      retorno = false;
      console.log('Acceso no permitido');
      this.navega.navegar('/inicio');
    }

    return retorno;
  }
}
