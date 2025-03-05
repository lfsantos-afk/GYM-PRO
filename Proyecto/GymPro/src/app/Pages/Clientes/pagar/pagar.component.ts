import {Component, OnInit} from '@angular/core';
import {Suscripcion} from 'Modelos/Interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {EstadoSuscripcion, Rutas} from 'Constantes/Constantes';
import {ClienteServicio} from 'Servicios/ClienteServicio';
import {FormsModule} from '@angular/forms';
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from 'ngx-paypal';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
export interface DatosAprobados {
  orderID: string
  payerID: string
  paymentID: string
  billingToken: any
  facilitatorAccessToken: string
  paymentSource: string
}

@Component({
  selector: 'app-pagar',
  imports: [
    FormsModule,
    NgxPayPalModule,
    CurrencyPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './pagar.component.html',
  styleUrl: './pagar.component.css'
})
export class PagarComponent implements OnInit {

  suscripcion: Suscripcion | null = null;
  payPalConfig?: IPayPalConfig;
  metodo = "card"
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
        this.initConfig();
      }
    }
  }

  async Pagar() {
    if (this.suscripcion !== null) {
      const result = await this.clienteServicio.HacerPago(this.suscripcion.id.toString(), this.suscripcion.Membresias.Precio,this.metodo);
      if (result === null) {
        this.notificar.NotificarBien("Pago realizado");
        await this.router.navigate([Rutas.Historial]);
      } else {
        this.notificar.NotificarError("Error al procesar el pago");
      }
    }
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AS-Ycnqh1WAceFpc9kfUmcIK2a0y3ZPeFzyAFFJx37sB_GRfbNiRvtxrTG9irMSl7Cf8Us0blx68mLqg',
      createOrderOnClient: (data: any) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.suscripcion?.Membresias?.Precio.toString() ?? "0",
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.suscripcion?.Membresias?.Precio.toString() ?? "0"
              }
            }
          },
          items: [{
            name: this.suscripcion?.Membresias?.Nombre ?? "",
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: this.suscripcion?.Membresias?.Precio.toString() ?? "0",
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data: any, actions: any) => {
        const result = data as DatosAprobados;
        this.metodo = result.paymentSource;
       },

      onClientAuthorization: async (data: any) => {
        await this.Pagar();

      },
      onCancel: (data: any, actions: any) => {
       this.notificar.NotificarWarning("Pago Cancelado");

      },
      onError: (err: any) => {
        this.notificar.NotificarBien("Error al realizar el pago");
      },
    };

  }

  protected readonly EstadoSuscripcion = EstadoSuscripcion;
}
