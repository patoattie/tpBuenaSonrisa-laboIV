import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiasService } from '../../servicios/dias.service';
import { ToastService } from '../../servicios/toast.service';
import { Dia } from '../../clases/dia';
import { Dias } from '../../enums/dias.enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dias',
  templateUrl: './dias.component.html',
  styleUrls: ['./dias.component.css']
})
export class DiasComponent implements OnInit, OnDestroy {
  private listaDias: Dia[];
  public columnas: string[] = ['dia', 'hhDesde', 'hhHasta'];
  private desuscribir = new Subject<void>();
  public muestraDetalle = false;
  public fila: Dia;

  constructor(
    private dias: DiasService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.dias.traerTodos()
    .pipe(takeUntil(this.desuscribir))
    .subscribe(call => {
      if (call.length > 0) {
        this.listaDias = call;
      } else {
        this.poblarDias();
      }
    });
  }

  ngOnDestroy(): void {
    this.desuscribir.next();
    this.desuscribir.complete();
  }

  private poblarDias(): void {
    Object.values(Dias)
    .filter(unTipo => typeof unTipo === 'number')
    .forEach(unDia => {
      this.dias.traerUno(Number.parseInt(unDia.toString(), 10))
      .pipe(takeUntil(this.desuscribir))
      .subscribe(call => {
        if (!call) {
          const nuevo = new Dia();
          nuevo.uid = Number.parseInt(unDia.toString(), 10);
          nuevo.dia = Dias[nuevo.uid];
          this.dias.actualizar(Number.parseInt(unDia.toString(), 10), nuevo);
        }
      });
    });
  }

  public getDias(): Dia[] {
    return this.listaDias;
  }

  public editarFila(unDia: Dia): void {
    this.fila = unDia;
    this.muestraDetalle = true;
  }

  public cerrarDetalle(): void {
    this.muestraDetalle = false;
  }

  public mostrarError(msj: string): void {
    this.toast.mostrarError(msj);
  }

  public guardar(nuevo: Dia): void {
    this.dias.actualizar(nuevo.uid, nuevo)
    .then(() => {
      this.toast.mostrarOk('Actualización OK');
      this.cerrarDetalle();
    })
    .catch(e => console.log(e));
  }
}
