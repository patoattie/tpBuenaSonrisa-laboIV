import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private usuarios: UsuariosService) { }

  ngOnInit(): void { }

  public getTipoCliente() {
    return this.usuarios.getTipoCliente();
  }
}
