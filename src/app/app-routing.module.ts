import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoComponent } from './paginas/ingreso/ingreso.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { RegistroComponent } from './paginas/registro/registro.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },
  {
    path: 'login',
    component: IngresoComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'registro/:tipo',
    component: RegistroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
