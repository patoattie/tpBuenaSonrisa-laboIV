import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { IngresoComponent } from './paginas/ingreso/ingreso.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { DiasComponent } from './paginas/dias/dias.component';
import { ConsultoriosComponent } from './paginas/consultorios/consultorios.component';
import { HorariosComponent } from './paginas/horarios/horarios.component';
import { TurnosComponent } from './paginas/turnos/turnos.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/inicio']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['/principal']);

const routes: Routes = [
  {
    path: 'ingreso',
    component: IngresoComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
  {
    path: 'registro/:tipo',
    component: RegistroComponent/*,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }*/
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'dias',
    component: DiasComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'consultorios',
    component: ConsultoriosComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'horarios',
    component: HorariosComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'turnos',
    component: TurnosComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
