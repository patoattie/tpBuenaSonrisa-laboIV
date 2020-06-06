import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoComponent } from './paginas/ingreso/ingreso.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { AuthGuard } from './guards/auth.guard';
import { InnerPagesGuard } from './guards/inner-pages.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },
  {
    path: 'login',
    component: IngresoComponent,
    canActivate: [InnerPagesGuard]
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [InnerPagesGuard]
  },
  {
    path: 'registro/:tipo',
    component: RegistroComponent,
    canActivate: [InnerPagesGuard]
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
