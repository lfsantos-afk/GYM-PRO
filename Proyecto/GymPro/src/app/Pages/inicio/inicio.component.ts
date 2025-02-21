import {Component} from '@angular/core';
import {CrearSuscripcionComponent} from '../Clientes/crear-suscripcion/crear-suscripcion.component';
import {RouterLink} from '@angular/router';
import {Rutas} from 'Constantes/Constantes';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor() {
  }


  protected readonly Rutas = Rutas;
}
