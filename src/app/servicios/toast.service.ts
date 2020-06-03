import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private classError = 'snack-error';
  private classOk = 'snack-ok';
  private duracion = 2000;
  private error = 'Error inesperado';

  constructor(
    private snack: MatSnackBar
  ) { }

  public mostrarError(msj?: string, tiempo?: number): void {
    this.mostrarMensaje(this.classError, msj, tiempo);
  }

  public mostrarOk(msj?: string, tiempo?: number): void {
    this.mostrarMensaje(this.classOk, msj, tiempo);
  }

  private mostrarMensaje(tipo: string, msj?: string, tiempo?: number): void {
    this.snack.open(msj ? msj : this.error, '', {
      duration: tiempo ? tiempo : this.duracion,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo
    });
  }
}
