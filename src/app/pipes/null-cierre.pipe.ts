import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullCierre'
})
export class NullCierrePipe implements PipeTransform {

  transform(value: string): string {
    return value === null ? 'CERRADO' : value;
  }

}
