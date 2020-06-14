import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { NavegacionService } from '../../servicios/navegacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private usuarios: UsuariosService,
    private navega: NavegacionService
  ) { }

  ngOnInit(): void { }

  public getTipoCliente() {
    return this.usuarios.getTipoCliente();
  }

  public navegar(ruta: string): void {
    this.navega.navegar(ruta);
  }
}
