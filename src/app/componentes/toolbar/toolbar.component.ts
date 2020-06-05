import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private location: Location,
    private auth: AuthService
  ) { }

  ngOnInit(): void { }

  public irAtras(): void {
    if (this.puedeIrAtras()) {
      this.location.back();
    }
  }

  public puedeIrAtras(): boolean {
    return this.location.path() !== '/inicio';
  }

  public usuarioLogueado(): boolean {
    return this.auth.usuarioValido();
  }
}
