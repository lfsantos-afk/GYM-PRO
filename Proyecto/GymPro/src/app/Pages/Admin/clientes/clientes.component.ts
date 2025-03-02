import {Component, OnInit} from '@angular/core';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';
import {ClientesAdmin, Suscripcion} from 'Modelos/Interfaces';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Rutas} from 'Constantes/Constantes';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {HistorialClienteComponent} from '../historial-cliente/historial-cliente.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [
    HistorialClienteComponent,
    FormsModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: ClientesAdmin[] = [];
  mostrarHistorial = false;
  SuscripcionesCliente: Suscripcion[] = [];
  NombreCliente: string = "";

  constructor(private adminServicio: AdministradorServicio,
              private notificar: NotificacionServicio,
              private clienteServicio: ClienteServicio) {
  }

  async ngOnInit() {
    const result = await this.adminServicio.ObtenerClientes();
    if (result.clientes != null) {
      this.clientes = result.clientes;
    } else {
      this.notificar.NotificarError("Error al obtener los clientes.");
    }
  }

  async ObtenerHistorialCliente(clienteId: string, nombreCliente: string) {
    this.NombreCliente = nombreCliente;
    const result = await this.clienteServicio.ObtenerSuscripcionesCliente(clienteId);
    this.SuscripcionesCliente = result.Suscripciones;
    this.mostrarHistorial = true;

  }

  OcultarMostrarHistorial(): void {
    this.mostrarHistorial = false;
  }

  protected readonly Rutas = Rutas;
}
