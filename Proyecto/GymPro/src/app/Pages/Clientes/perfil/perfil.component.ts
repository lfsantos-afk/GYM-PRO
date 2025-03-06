import {Component, effect, inject, OnInit} from '@angular/core';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {AuthServicio} from '../../../Auth/AuthServicio';
import {Cliente, Suscripcion} from 'Modelos/Interfaces';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {DatePipe, JsonPipe, TitleCasePipe} from '@angular/common';
import {EstadoSuscripcion} from 'Constantes/Constantes';
import {PasswordComponent} from '../GestionPerfil/password/password.component';

@Component({
  selector: 'app-perfil',
  imports: [
    TitleCasePipe,
    DatePipe,
    PasswordComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  private authServ = inject(AuthServicio);
  private clienteServ = inject(ClienteServicio);
  private notificar = inject(NotificacionServicio);
  cliente: Cliente | null = null;
  Suscripciones: Suscripcion[] = [];
  cambiarPassword = false;

  constructor() {
    this.authServ.ObtenerClienteActual().then(x => {
      this.cliente = x.cliente;
    });
  }

  async ngOnInit() {
    await this.CargarSuscripciones();
  }

  private async CargarSuscripciones() {
    const clienteActual = await this.authServ.ObtenerClienteActual();
    const result = await this.clienteServ.ObtenerSuscripcionesCliente(clienteActual.cliente?.id.toString() ?? "");
    this.Suscripciones = result.Suscripciones;
  }


  editarPerfil()
    :
    void {
    // Lógica para editar perfil
    console.log('Editar perfil');
  }

  cambiarContrasena()
    :
    void {
    this.cambiarPassword = true;
    // Lógica para cambiar contraseña
    console.log('Cambiar contraseña');
  }

  suspenderMembresia()
    :
    void {
    // Lógica para suspender membresía
    console.log('Suspender membresía');
  }

  eliminarCuenta()
    :
    void {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')
    ) {
      // Lógica para eliminar cuenta
      console.log('Eliminar cuenta');
    }
  }

  CerrarSubMenu() {
    this.cambiarPassword = false;
  }

  protected readonly EstadoSuscripcion = EstadoSuscripcion;


}
