import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Login } from '../../clases/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() login: Login;
  @Output() ingresarEvent = new EventEmitter<Login>();
  public ocultaClave = true;
  public loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: [this.login.correo, [Validators.required, Validators.email]],
      clave: [this.login.clave, [Validators.required, Validators.minLength(6)]]
    });
  }

  public ingresar() {
    if (this.loginForm.valid) {
      this.login.correo = this.loginForm.controls.correo.value;
      this.login.clave = this.loginForm.controls.clave.value;
      this.ingresarEvent.emit(this.login);
    }
  }

  /*public salir() {
    this.auth.logout();
  }*/

  // public mostrarError(error: any) {
  public mostrarError(control: string): string {
    /*switch (error.code) {
      case 'auth/wrong-password':
        console.log('Usuario o contraseña invalidos');
        break;
      case 'auth/user-not-found':
        console.log('Usuario o contraseña invalidos');
        break;
      default:
        console.log('ERROR: ', error);
    }*/
    let retorno = '';

    switch (control) {
      case 'correo':
        if (this.loginForm.controls.correo.hasError('required')) {
          retorno = 'Debe ingresar un correo electrónico';
        } else if (this.loginForm.controls.correo.hasError('email')) {
          retorno = 'El correo electrónico ingresado no es válido';
        } else {
          retorno = 'Error inesperado con el correo electrónico';
        }
        break;
      case 'clave':
        if (this.loginForm.controls.clave.hasError('required')) {
          retorno = 'Debe ingresar una clave';
        } else if (this.loginForm.controls.clave.hasError('minlength')) {
          retorno = 'La clave ingresada debe contener al menos 6 caracteres';
        } else {
          retorno = 'Error inesperado con la clave';
        }
        break;
    }

    return retorno;
  }

  public estaLogueado(): boolean {
    return this.auth.usuarioValido();
  }
}
