import {Component, OnInit} from '@angular/core';
import {Suscripcion} from 'Modelos/Interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Rutas} from 'Constantes/Constantes';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-pagar',
  imports: [
    FormsModule
  ],
  templateUrl: './pagar.component.html',
  styleUrl: './pagar.component.css'
})
export class PagarComponent implements OnInit {

  suscripcion: Suscripcion | null = null;

  constructor(
    private clienteServicio: ClienteServicio,
    private router: Router,
    private route: ActivatedRoute,
    private notificar: NotificacionServicio) {
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      this.notificar.NotificarError("No encontramos tu suscripcion :(");
      await this.router.navigate([Rutas.Historial]);
    } else {
      const result = await this.clienteServicio.ObtenerUnaSuscripionCliente(id.toString())
      if (result.error) {
        this.notificar.NotificarError("error al cargar el sistema de pagos....");
      } else {
        this.suscripcion = result.suscripcion;
      }
    }
  }

  async Pagar() {
    if (this.suscripcion !== null) {
      const result = await this.clienteServicio.HacerPago(this.suscripcion.id.toString(), this.suscripcion.Membresias.Precio);
      if (result === null) {
        this.notificar.NotificarBien("Pago realizado");
        this.router.navigate([Rutas.Historial]);
      } else {
        this.notificar.NotificarError("Error al procesar el pago");
      }
    }
  }
}
