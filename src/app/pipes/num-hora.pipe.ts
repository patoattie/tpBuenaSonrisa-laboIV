import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numHora'
})
export class NumHoraPipe implements PipeTransform {

  transform(value: number): string {
    return typeof value === 'number' ? value.toString().concat(':00') : value;
  }

}
