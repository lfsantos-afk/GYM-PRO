import {Component, OnInit} from '@angular/core';
import {Membresia} from 'Modelos/Interfaces';
import {MembresiaServicio} from 'Servicios/MembresiaServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {EstadoSuscripcion, Rutas} from 'Constantes/Constantes';
import {AuthServicio} from '../../Auth/AuthServicio';
import {Roles} from 'Constantes/Roles';
import {Router, RouterLink} from '@angular/router';
import {ClienteServicio} from 'Servicios/ClienteServicio';

@Component({
  selector: 'app-membresias',
  imports: [
    RouterLink
  ],
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css'
})
export class MembresiasComponent implements OnInit {
  membresias: Membresia[] = [];
  role: string | null = null;
  clienteActualMembresias: string[] = [];


  constructor(private membresiaServ: MembresiaServicio,
              private NotificacionServ: NotificacionServicio,
              private authServicio: AuthServicio,
              private router: Router,
              private clienteServicio: ClienteServicio) {
  }

  async ngOnInit() {
    this.authServicio.usuarioRolAction.subscribe(
      role => {
        this.role = role;
        if (role == Roles.Client) {
          this.ObtenerMembresiasCliente();
        }
      }
    );
    const result = await this.membresiaServ.ObtenerMembresias();

    if (result.error === null) {
      this.membresias = result.membresias ?? [];
    } else {
      this.NotificacionServ.NotificarError("Algo salio mal al obtener las membresias");
    }
  }


  ObtenerTiempoMembresia(membresia: Membresia) {

    if (membresia) {
      let result = "mensual";
      if (membresia.DuracionMeses == 1) {
        result = "mensual";
      } else if (membresia.DuracionMeses == 3) {
        result = "trimestral";
      } else if (membresia.DuracionMeses == 6) {
        result = "semestral";
      } else if (membresia.DuracionMeses == 12) {
        result = "anual";
      } else {
        result = membresia.DuracionMeses + " Meses";
      }
      return result;

    } else {
      return "";
    }
  }

  async ObtenerMembresiasCliente() {
    const clienteActual = await this.authServicio.ObtenerClienteActual();
    if (clienteActual.cliente !== null) {
      const resultado = await this.clienteServicio.ObtenerSuscripcionesCliente(clienteActual.cliente?.id);
      this.clienteActualMembresias = resultado.Suscripciones.filter(x => x.Estatus == EstadoSuscripcion.Activa || x.Estatus == EstadoSuscripcion.ActivaCancelada).map(x => x.MembresiaId.toString());
    }
  }


  protected readonly Rutas = Rutas;
  protected readonly Roles = Roles;


}
