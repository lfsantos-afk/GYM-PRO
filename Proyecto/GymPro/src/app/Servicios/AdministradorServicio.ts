import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {ClientesAdmin, Membresia, Suscripcion} from 'Modelos/Interfaces';
import {ReporteSuscripciones, SuscripcionesReportes} from 'Modelos/Reportes';
import {EstadoSuscripcion} from 'Constantes/Constantes';


@Injectable({providedIn: 'root'})
export class AdministradorServicio {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
  }

  async ObtenerClientes() {

    let {data: Clientes, error} = await this.supabase
      .from('Clientes')
      .select('*') as { data: ClientesAdmin[], error: any };

    return {clientes: Clientes, error: error};
  }

  async ObtenerSuscripciones() {
    let {data: Suscripciones, error} = await this.supabase
      .from('Suscripciones')
      .select('*,Membresias(*)') as { data: Suscripcion[], error: any };
    return {Suscripciones, error};
  }

  async ObtenerReportes() {
    const suscripciones = await this.ObtenerDatosSuscripciones();
    const pagos = await this.ObtenerPagos();
    const clientes = await this.ObtenerClientes();

    const formateados = this.FormatearDatos(suscripciones, pagos);
    return {
      ...formateados,
      totalSuscripciones: suscripciones.length,
      totalClientes: clientes.clientes.length,

    }
  }

  private FormatearDatos(suscripciones: SuscripcionesReportes[], pagos: { Monto: number, Fecha: string }[]) {

    let valoresPorDefecto: { [p: string]: { cantidad: number; nombre: string } } = {
      [EstadoSuscripcion.Activa]:
        {
          cantidad: 0, nombre: EstadoSuscripcion.Activa
        },
      [EstadoSuscripcion.ActivaCancelada]:
        {
          cantidad: 0, nombre: EstadoSuscripcion.ActivaCancelada
        },
      [EstadoSuscripcion.FaltaPago]:
        {
          cantidad: 0, nombre: EstadoSuscripcion.FaltaPago
        },
      [EstadoSuscripcion.Cancelada]:
        {
          cantidad: 0, nombre: EstadoSuscripcion.Cancelada
        }
    };
    const resultSuscripciones = suscripciones.reduce<{
      [key: string]: { cantidad: number, nombre: string }
    }>((guardados , actual, index) => {
      if(index===0){
        guardados = valoresPorDefecto;
      }
      const estado = actual.Estatus;

      if (!guardados[estado]) {
        guardados[estado] = {
          cantidad: 0,
          nombre: estado
        }
      }
      guardados[estado].cantidad++;
      return guardados;
    }, {});
    // const resultSuscripciones = suscripciones.reduce<{
    //   [key: number]: { cantidad: number, nombre: string }
    // }>((guardados, actual) => {
    //   const membresiaId = actual.MembresiaId;
    //   if (!guardados[membresiaId]) {
    //     guardados[membresiaId] = {
    //       cantidad: 0,
    //       nombre: actual.Membresias.Nombre
    //     }
    //   }
    //   guardados[membresiaId].cantidad++;
    //   return guardados;
    // }, {});


    const resultPagos = pagos.reduce<{
      [key: string]: { monto: number, fecha: string }
    }>((guardados, actual) => {
      const fecha = actual.Fecha.slice(0, 7);

      if (!guardados[fecha]) {
        guardados[fecha] = {
          monto: 0,
          fecha: fecha
        }
      }
      guardados[fecha].monto += actual.Monto;
      return guardados;
    }, {});
    const suscripcionesFechaUno = suscripciones.reduce((acumulador, suscripcion) => {
      const nombreMembresia = suscripcion.Membresias.Nombre;
      const fecha = new Date(suscripcion.Inicia).toISOString().split('T')[0];

      // Crear la membresía si no existe
      if (!acumulador[nombreMembresia]) {
        acumulador[nombreMembresia] = {};
      }

      // Aumentar la cantidad para esa fecha
      if (!acumulador[nombreMembresia][fecha]) {
        acumulador[nombreMembresia][fecha] = 1;
      } else {
        acumulador[nombreMembresia][fecha]++;
      }

      return acumulador;
    }, {} as { [nombreMembresia: string]: { [fecha: string]: number } });

    const resultFecha = Object.entries(suscripcionesFechaUno).reduce((acumulador, [nombreMembresia, fechas]) => {

      acumulador[nombreMembresia] = {
        nombre: nombreMembresia,
        fechas: Object.entries(fechas)
          .map(([fecha, cantidad]) => ({fecha, cantidad}))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      };

      return acumulador;
    }, {} as ReporteSuscripciones);


    return {
      TotalPagado: pagos.reduce((total, pago) => total + pago.Monto, 0),
      pagosMensuales: Object.values(resultPagos),
      suscripcionesMensuales: Object.values(resultFecha),
      suscripcionesPorEstado: Object.values(resultSuscripciones),
    }


  }

  private async ObtenerDatosSuscripciones() {
    const {data, error} = await this.supabase
      .from("Suscripciones")
      .select('*,Membresias(*), Clientes(*)') as { data: SuscripcionesReportes[], error: any };
    return data;
  }

  private async ObtenerPagos() {
    const {data, error} = await this.supabase
      .from('Pagos')
      .select('Monto,Fecha') as { data: { Monto: number, Fecha: string }[], error: any };
    return data;
  }
}
