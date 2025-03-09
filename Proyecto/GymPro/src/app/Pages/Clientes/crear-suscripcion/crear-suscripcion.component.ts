import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Membresia, Suscripcion} from 'Modelos/Interfaces';
import {MembresiaServicio} from 'Servicios/MembresiaServicio';
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Rutas} from 'Constantes/Constantes';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from 'ngx-paypal';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-crear-suscripcion',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgxPayPalModule,
    DatePipe
  ],
  templateUrl: './crear-suscripcion.component.html',
  styleUrl: './crear-suscripcion.component.css'
})
export class CrearSuscripcionComponent implements OnInit {

  suscripcion = {
    inicia: new Date().toISOString().split('T')[0],
    finaliza: "-- / -- / --",
    membresiaId: "",
    renovante: true
  }
  membresia: Membresia | null = null;
  minInicia = new Date().toISOString().split('T')[0];
  public payPalConfig ?: IPayPalConfig;

  constructor(private serv: MembresiaServicio,
              private clienteServicio: ClienteServicio,
              private route: ActivatedRoute,
              private notificar: NotificacionServicio,
              private router: Router,) {

  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      const result = await this.serv.ObtenerMembresiaById(id);
      this.membresia = result.membresia ?? null;
      if (this.membresia) {
        this.suscripcion.membresiaId = this.membresia.id.toString();
        this.ActualizarFinaliza();
      }
    } else {
      this.notificar.NotificarError("Membresia no encontrada 😀");
      await this.router.navigate([Rutas.Membresias]);
    }
  }

  ObtenerTiempoMembresia() {

    if (this.membresia) {

      let result = "mensual";
      if (this.membresia.DuracionMeses == 1) {
        result = "mensual";
      } else if (this.membresia.DuracionMeses == 3) {
        result = "trimestral";
      } else if (this.membresia.DuracionMeses == 6) {
        result = "semestral";
      } else if (this.membresia.DuracionMeses == 12) {
        result = "anual";
      } else {
        result = this.membresia.DuracionMeses + " Meses";
      }
      return result;

    } else {
      return "";
    }
  }

  async enviar() {

    const result = await this.clienteServicio.RegistrarSuscripcion(this.suscripcion.membresiaId,
      this.suscripcion.inicia,
      this.suscripcion.finaliza,
      this.suscripcion.renovante);
    if (result.error) {
      this.notificar.NotificarError("Error al guardar tu suscripcion :(");
      this.notificar.NotificarError(result.error as string);

    } else {
      this.notificar.NotificarBien("Suscripcion guardada. Hagamos el pago");
      await this.router.navigate([Rutas.Pagar, result.mensaje]);
    }
  }


  ActualizarFinaliza() {
    const finaliza = new Date(this.suscripcion.inicia);
    finaliza.setMonth(finaliza.getMonth() + (this.membresia?.DuracionMeses ?? 0));
    this.suscripcion.finaliza = finaliza.toISOString().split('T')[0];
  }

  protected readonly Rutas = Rutas;


}
