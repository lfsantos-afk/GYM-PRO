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
  clientesFiltrados: ClientesAdmin[] = [];
  filtro: string = "";

  constructor(private adminServicio: AdministradorServicio,
              private notificar: NotificacionServicio,
              private clienteServicio: ClienteServicio) {
  }

  async ngOnInit() {
    const result = await this.adminServicio.ObtenerClientes();
    if (result.clientes != null) {
      this.clientes = result.clientes;
      this.clientesFiltrados = this.clientes;
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

  filtrarClientes(): void {
    if (!this.filtro.trim()) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    const term = this.filtro.toLowerCase().trim();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.Nombre.toLowerCase().includes(term) ||
      cliente.Apellido.toLowerCase().includes(term) ||
      cliente.id.toString().includes(term) ||
      (cliente.Telefono && cliente.Telefono.includes(term)) ||
      (cliente.Direccion && cliente.Direccion.toLowerCase().includes(term))
    );
  }

  OcultarMostrarHistorial(): void {
    this.mostrarHistorial = false;
  }

  protected readonly Rutas = Rutas;
}
