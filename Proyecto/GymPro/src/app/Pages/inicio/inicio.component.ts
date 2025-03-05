import {Component} from '@angular/core';
import {CrearSuscripcionComponent} from '../Clientes/crear-suscripcion/crear-suscripcion.component';
import {RouterLink} from '@angular/router';
import {Rutas} from 'Constantes/Constantes';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('logoAnimation', [
      state('in', style({ transform: 'scale(1)' })),
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class InicioComponent {
  constructor() {
  }


  protected readonly Rutas = Rutas;
}
