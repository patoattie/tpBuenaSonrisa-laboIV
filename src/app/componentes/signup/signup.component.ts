import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoUsuario } from '../../enums/tipo-usuario.enum';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Input() usuario: Usuario;
  @Input() tipo: string;
  @Output() registrarEvent = new EventEmitter<Usuario>();
  @Output() claveEvent = new EventEmitter<string>();
  @Output() fotoEvent = new EventEmitter<File>();
  private ocultaClave = true;
  private ocultaConfirma = true;
  public signupForm: FormGroup;
  public errConfirmaClave = false;
  private fotoUsuario: File = null;
  private captcha: string;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      correo: ['', Validators.compose([Validators.required, Validators.email])],
      nombre: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      clave: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirma: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      telefono: ['', Validators.compose([])],
      foto: ['', Validators.compose([])]
    });
  }

  public registrar() {
    if (this.signupForm.controls.clave.value !== this.signupForm.controls.confirma.value) {
      this.errConfirmaClave = true;
    } else {
      this.errConfirmaClave = false;
      if (this.signupForm.valid) {
        this.usuario.email = this.signupForm.controls.correo.value;
        this.usuario.displayName = this.signupForm.controls.nombre.value;
        this.usuario.phoneNumber = this.signupForm.controls.telefono.value;
        this.usuario.photoURL = '';
        this.usuario.tipo = this.tipo;
        this.claveEvent.emit(this.signupForm.controls.clave.value);
        this.fotoEvent.emit(this.fotoUsuario);
        this.registrarEvent.emit(this.usuario);
      }
    }
  }

  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'correo':
        if (this.signupForm.controls.correo.hasError('required')) {
          retorno = 'Debe ingresar un correo electrónico';
        } else if (this.signupForm.controls.correo.hasError('email')) {
          retorno = 'El correo electrónico ingresado no es válido';
        } else {
          retorno = 'Error inesperado con el correo electrónico';
        }
        break;
      case 'clave':
        if (this.signupForm.controls.clave.hasError('required')) {
          retorno = 'Debe ingresar una clave';
        } else if (this.signupForm.controls.clave.hasError('minlength')) {
          retorno = 'La clave ingresada debe contener al menos 6 caracteres';
        } else {
          retorno = 'Error inesperado con la clave';
        }
        break;
      case 'nombre':
        if (this.signupForm.controls.nombre.hasError('required')) {
          retorno = 'Debe ingresar un nombre y apellido';
        } else if (this.signupForm.controls.nombre.hasError('minlength')) {
          retorno = 'El nombre y apellido ingresado debe contener al menos 2 caracteres';
        } else {
          retorno = 'Error inesperado con el nombre y apellido';
        }
        break;
    }

    return retorno;
  }

  public manejoFoto(archivos: FileList): void {
    this.fotoUsuario = archivos.item(0);
  }

  public setRecaptcha(captchaResponse: string): void {
    // console.log('Respuesta: ', captchaResponse);
    this.captcha = captchaResponse;
  }

  public getCaptcha(): string {
    return this.captcha;
  }

  public setOcultaClave(valor: boolean): void {
    this.ocultaClave = valor;
  }

  public getOcultaClave(): boolean {
    return this.ocultaClave;
  }

  public setOcultaConfirma(valor: boolean): void {
    this.ocultaConfirma = valor;
  }

  public getOcultaConfirma(): boolean {
    return this.ocultaConfirma;
  }
}
