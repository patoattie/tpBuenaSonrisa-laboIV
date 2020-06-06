import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarios: UsuariosService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let retorno = true;

    if (!this.usuarios.usuarioValido()) {
      retorno = false;
      console.log('Acceso no permitido');
      this.router.navigate(['inicio']);
    }

    return retorno;
  }
}
