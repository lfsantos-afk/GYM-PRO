import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthRutas} from 'Constantes/Constantes';

@Component({
  selector: 'app-no-permiso',
  imports: [
    RouterLink
  ],
  templateUrl: './no-permiso.component.html',
  styleUrl: './no-permiso.component.css'
})
export class NoPermisoComponent {

  protected readonly AuthRutas = AuthRutas;
}
