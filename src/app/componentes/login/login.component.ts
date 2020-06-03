import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../clases/login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../servicios/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() login: Login;
  @Output() ingresarEvent = new EventEmitter<Login>();
  public ocultaClave = true;
  public loginForm: FormGroup;
  private desuscribir = new Subject<void>();

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: [this.login.correo, [Validators.required, Validators.email]],
      clave: [this.login.clave, [Validators.required, Validators.minLength(6)]]
    });

    this.auth.getError()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(unError => {
      if (unError) {
        this.mostrarError(unError);
      }
    });
  }

  ngOnDestroy(): void {

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
      case 'auth/wrong-password':
        this.snack.open('Usuario o contraseña invalidos', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snack-error'
        });
        break;
      case 'auth/user-not-found':
        this.snack.open('Usuario o contraseña invalidos', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snack-error'
        });
        break;
      case 'auth/too-many-requests':
        this.snack.open('Usuario o contraseña invalidos', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snack-error'
        });
        break;
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
}
