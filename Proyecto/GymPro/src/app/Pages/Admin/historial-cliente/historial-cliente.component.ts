import {AfterContentInit, Component, Input} from '@angular/core';
import {Suscripcion} from 'Modelos/Interfaces';
import {NgClass} from '@angular/common';
import {EstadoSuscripcion, Rutas} from 'Constantes/Constantes';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-historial-cliente-admin',
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './historial-cliente.component.html',
  styleUrl: './historial-cliente.component.css'
})
export class HistorialClienteComponent implements AfterContentInit {
  @Input({required: true}) Suscripciones!: Suscripcion[];
  @Input({required: true}) NombreCliente!: string;
  suscripcionActual: Suscripcion | null = null;
  Filter = "Todas";
  SuscripcionesFiltradas: Suscripcion[] = [];

  ngAfterContentInit() {
    this.suscripcionActual = this.Suscripciones?.filter(x => x.Estatus == EstadoSuscripcion.Activa)[0] ?? null;
    this.SuscripcionesFiltradas = this.Suscripciones;
  }


  Filtrar() {
    if (this.Filter === "Todas") {
      this.SuscripcionesFiltradas = this.Suscripciones;
    } else {
      this.SuscripcionesFiltradas = this.Suscripciones.filter(x => x.Estatus == this.Filter);
    }
  }


  protected readonly EstadoSuscripcion = EstadoSuscripcion;
  protected readonly Rutas = Rutas;
}
