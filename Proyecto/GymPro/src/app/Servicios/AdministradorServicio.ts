import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {ClientesAdmin, Suscripcion} from 'Modelos/Interfaces';

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
}
