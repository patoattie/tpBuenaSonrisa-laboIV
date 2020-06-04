import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void { }

  public irAtras(): void {
    if (this.puedeIrAtras()) {
      this.location.back();
    }
  }

  public puedeIrAtras(): boolean {
    return this.location.path() !== '/inicio';
  }
}
