import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../clases/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() login: Login;
  @Output() ingresarEvent = new EventEmitter<Login>();
  private ocultaClave = true;
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: [this.login.correo, Validators.compose([Validators.required, Validators.email])],
      clave: [this.login.clave, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  public ingresar() {
    if (this.loginForm.valid) {
      this.login.correo = this.loginForm.controls.correo.value;
      this.login.clave = this.loginForm.controls.clave.value;
      this.ingresarEvent.emit(this.login);
    }
  }

  public mostrarError(control: string): string {
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

  public setOcultaClave(valor: boolean): void {
    this.ocultaClave = valor;
  }

  public getOcultaClave(): boolean {
    return this.ocultaClave;
  }
}
