import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {Membresia} from 'Modelos/Interfaces';
import {EstadoSuscripcion} from 'Constantes/Constantes';
import {AuthServicio} from '../Auth/AuthServicio';


@Injectable({providedIn: 'root'})
export class MembresiaServicio {
  private supabase: SupabaseClient;

  constructor(private auth: AuthServicio) {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
  }

  async ObtenerMembresias(todas: boolean = false) {
    let {data: membresias, error} = await this.supabase
      .from('Membresias')
      .select('*')
      .eq('Activa', todas ? undefined : 'true') as { data: Membresia[] | null, error: any };
    return {membresias, error};
  }

  async ObtenerMembresiaById(id: string) {
    let {data: membresia, error} = await this.supabase
      .from('Membresias')
      .select('*')
      .eq('id', id)
      .limit(1) as { data: Membresia[] | null, error: any };

    return {membresia: membresia?.[0], error};
  }


}
