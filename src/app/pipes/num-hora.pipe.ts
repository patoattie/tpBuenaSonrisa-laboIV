import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numHora'
})
export class NumHoraPipe implements PipeTransform {

  transform(value: number): string {
    return typeof value === 'number'
      ? Math.floor(value).toString() // Parte entera (hora)
        .concat(':') // Separador de hora
        .concat(((value % 1) * 60).toString().padStart(2, '0')) // Parte decimal (minutos)
      : value;
  }

}
