import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { IngresoComponent } from './paginas/ingreso/ingreso.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ToolbarComponent } from './componentes/toolbar/toolbar.component';
import { SignupComponent } from './componentes/signup/signup.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { DiasComponent } from './paginas/dias/dias.component';
import { NullCierrePipe } from './pipes/null-cierre.pipe';
import { DiaComponent } from './componentes/dia/dia.component';
import { NumHoraPipe } from './pipes/num-hora.pipe';
import { ConsultoriosComponent } from './paginas/consultorios/consultorios.component';
import { ConsultorioComponent } from './componentes/consultorio/consultorio.component';
import { HorariosComponent } from './paginas/horarios/horarios.component';
import { HorarioComponent } from './componentes/horario/horario.component';
import { TurnosComponent } from './paginas/turnos/turnos.component';
import { TurnoComponent } from './componentes/turno/turno.component';
import { ReseniaComponent } from './componentes/resenia/resenia.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export function tokenGetter() {
  return localStorage.getItem('usuario');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IngresoComponent,
    InicioComponent,
    ToolbarComponent,
    SignupComponent,
    RegistroComponent,
    PrincipalComponent,
    DiasComponent,
    NullCierrePipe,
    DiaComponent,
    NumHoraPipe,
    ConsultoriosComponent,
    ConsultorioComponent,
    HorariosComponent,
    HorarioComponent,
    TurnosComponent,
    TurnoComponent,
    ReseniaComponent,
    EncuestaComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    RecaptchaModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule
  ],
  providers: [
    DatePipe,
    NumHoraPipe,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6LdcgF0pAAAAAG5rF0MHE31rjgb1NadA3chzkok_' } as RecaptchaSettings
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
