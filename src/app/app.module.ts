import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';

export function tokenGetter() {
  return localStorage.getItem('usuario');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxAuthFirebaseUIModule.forRoot(
      environment.firebaseConfig,
      () => 'Buena Sonrisa',
      {
        enableFirestoreSync: false, // enable/disable autosync users with firestore
        toastMessageOnAuthSuccess: false,
        toastMessageOnAuthError: false,
        passwordMinLength: 6,
        passwordMaxLength: 60,
        enableEmailVerification: false
      }
    ),
    MatPasswordStrengthModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
