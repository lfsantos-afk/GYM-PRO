import {Component, Input} from '@angular/core';
import {Suscripcion} from 'Modelos/Interfaces';

@Component({
  selector: 'app-historial-cliente-admin',
  imports: [],
  templateUrl: './historial-cliente.component.html',
  styleUrl: './historial-cliente.component.css'
})
export class HistorialClienteComponent{
  @Input({required: true}) Suscripciones!: Suscripcion[];
  @Input({required: true}) NombreCliente!: string;
}
