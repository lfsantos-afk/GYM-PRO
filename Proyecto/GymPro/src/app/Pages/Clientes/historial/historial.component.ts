import {Component, OnInit} from '@angular/core';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {AuthServicio} from '../../../Auth/AuthServicio';
import {Suscripcion} from 'Modelos/Interfaces';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {EstadoSuscripcion, Rutas} from 'Constantes/Constantes';
import {RouterLink} from '@angular/router';
import {DatePipe, NgClass} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {color} from 'chart.js/helpers';

@Component({
  selector: 'app-historial',
  imports: [
    RouterLink,
    NgClass,
    DatePipe,
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('600ms ease-out', style({opacity: 1}))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('600ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ]),
    trigger('animateOnInit', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms 300ms ease-out', style({opacity: 1}))
      ])
    ])
  ]
})
export class HistorialComponent implements OnInit {

  Suscripciones: Suscripcion[] = [];
  filtroActual: string = 'todas';
  estadosSuscripcion = [
    {nombre: 'Todas', valor: 'todas'},
    {nombre: 'Activas', valor: EstadoSuscripcion.Activa},
    {nombre: 'Canceladas', valor: EstadoSuscripcion.Cancelada},
    {nombre: 'Pendientes de pago', valor: EstadoSuscripcion.FaltaPago},
    {nombre: 'Activas-CANCELADAS', valor: EstadoSuscripcion.ActivaCancelada}
  ];
  AlgunaActiva = false;


  get suscripcionesFiltradas(): Suscripcion[] {
    if (this.filtroActual === 'todas') {
      return this.Suscripciones;
    }
    return this.Suscripciones.filter(s => s.Estatus === this.filtroActual);
  }

  constructor(private clienteService: ClienteServicio, private auth: AuthServicio, private notificacion: NotificacionServicio) {
  }

  async ngOnInit() {
    await this.ObtenerSuscripciones();
  }

  private async ObtenerSuscripciones() {
    const idCliente = await this.auth.ObtenerClienteActual() ?? "";
    const result = await this.clienteService.ObtenerSuscripcionesCliente(idCliente.cliente?.id ?? "");
    if (result.error) {
      this.notificacion.NotificarError("Algo salio mal al cargar tus suscripciones :(");
    } else {
      this.Suscripciones = result.Suscripciones;
      this.AlgunaActiva = this.Suscripciones.filter(x => x.Estatus === EstadoSuscripcion.Activa).length > 0;
    }
  }

  filtrarPor(estado: string): void {
    this.filtroActual = estado;
  }

  // Método para calcular días restantes
  diasRestantes(fecha: string): number {
    const hoy = new Date();
    const fechaFin = new Date(fecha);
    const diferencia = fechaFin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }


  protected readonly EstadoSuscripcion = EstadoSuscripcion;
  protected readonly color = color;
  protected readonly Rutas = Rutas;

  async CancelarSuscripcion(id: number) {
    if (confirm("Seguro que quieras cancelar esta suscripcion")) {
      const result = await this.clienteService.CancelarSuscripcion(id);
      if (result) {
        this.notificacion.NotificarBien("Suscripcion cancelada");
        await this.ObtenerSuscripciones();
      } else {
        this.notificacion.NotificarError("Error al cancelar la solcitud");

      }
    }

  }
}
