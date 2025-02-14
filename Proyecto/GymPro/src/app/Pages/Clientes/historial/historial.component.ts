import {Component, OnInit} from '@angular/core';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {AuthServicio} from '../../../Auth/AuthServicio';
import {Suscripcion} from 'Modelos/Interfaces';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {EstadoSuscripcion} from 'Constantes/Constantes';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-historial',
  imports: [
    RouterLink
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  Suscripciones: Suscripcion[] = [];

  constructor(private clienteService: ClienteServicio, private auth: AuthServicio, private notificacion: NotificacionServicio) {
  }

  async ngOnInit() {
    const idCliente = await this.auth.ObtenerClienteActual() ?? "";
    const result = await this.clienteService.ObtenerSuscripcionesCliente(idCliente.cliente?.id ?? "");
    if (result.error) {
      this.notificacion.NotificarError("Algo salio mal al cargar tus suscripciones :(");
    }
    else {
      this.Suscripciones = result.Suscripciones;
    }
  }

  protected readonly EstadoSuscripcion = EstadoSuscripcion;
}
