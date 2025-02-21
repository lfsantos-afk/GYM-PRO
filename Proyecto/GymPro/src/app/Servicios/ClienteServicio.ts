import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {Pago, Suscripcion} from 'Modelos/Interfaces';
import {EstadoSuscripcion} from 'Constantes/Constantes';
import {AuthServicio} from '../Auth/AuthServicio';


@Injectable({providedIn: 'root'})
export class ClienteServicio {

  private supabase: SupabaseClient;

  constructor(private auth: AuthServicio) {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
  }

  async ObtenerSuscripcionesCliente(clienteId: string) {
    let {data: Suscripciones, error} = await this.supabase
      .from('Suscripciones')
      .select('*,Membresias(*)')
      .eq("ClienteId", clienteId) as { data: Suscripcion[], error: any };
    return {Suscripciones, error};

  }

  async ObtenerUnaSuscripionCliente(suscripcionId: string) {
    const cliente = await this.auth.ObtenerClienteActual();
    if (cliente === null) {
      return {suscripcion: null, error: "Cliente no encontrado"};
    }
    let {data: Suscripciones, error} = await this.supabase
      .from('Suscripciones')
      .select('*,Membresias(*)')
      .eq("id", suscripcionId)
      .eq("ClienteId", cliente.cliente?.id) as { data: Suscripcion[], error: any };
    return {suscripcion: Suscripciones?.[0], error};

  }

  async RegistrarSuscripcion(MembresiaId: string, Inicia: string, Finaliza: string, renovante: boolean) {

    const cliente = await this.auth.ObtenerClienteActual();
    if (cliente.cliente === null) {
      return {mensaje: null, error: `Upps. ${cliente.error}`}
    }

    const {data, error} = await this.supabase
      .from('Suscripciones')
      .insert(
        {
          ClienteId: cliente.cliente.id,
          MembresiaId: MembresiaId,
          Inicia: Inicia,
          Finaliza: Finaliza,
          Renovante: renovante,
          Estatus: EstadoSuscripcion.FaltaPago
        }
      )
      .select() as { data: Suscripcion[], error: any };


    return {mensaje: data?.[0].id, error};

  }


  async HacerPago(SuscripcionId: string, monto: number) {
    let devolver: string | null = null;
    const {data, error} = await this.supabase
      .from('Pagos')
      .insert(
        {
          "SubscripcionId": SuscripcionId,
          "Monto": monto,
          "metodo": "en linea",
          "Estatus": "completado"
        },
      ).select("*,Suscripciones(id, Membresias(id,Precio))") as { data: Pago[], error: any };

    if (data !== null) {
      const resultSuscripciones = await this.supabase
        .from('Suscripciones')
        .update({"Estatus": EstadoSuscripcion.Activa})
        .eq('id', data?.[0].Suscripciones.id)
        .select() as { data: Suscripcion[], error: any };
      devolver = resultSuscripciones?.error?.message ?? null;
      console.info("resultado de actualizar suscripcion", resultSuscripciones.data);
      console.error(resultSuscripciones.error);
    } else {
      devolver = error?.message ?? null;
    }
    return devolver;
  }
}

