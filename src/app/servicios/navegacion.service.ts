import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) { }

  public navegar(ruta: string): void {
    this.ngZone.run(() => this.router.navigate([ruta]));
  }
}
