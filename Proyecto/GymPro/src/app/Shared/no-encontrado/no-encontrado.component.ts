import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Rutas} from 'Constantes/Constantes';

@Component({
  selector: 'app-no-encontrado',
  imports: [
    RouterLink
  ],
  templateUrl: './no-encontrado.component.html',
  styleUrl: './no-encontrado.component.css'
})
export class NoEncontradoComponent {

  protected readonly Rutas = Rutas;
}
