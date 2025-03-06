import {Injectable} from "@angular/core";
import {environment} from '../../environments/environment';
import {
  createClient,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
  User,
  UserMetadata
} from '@supabase/supabase-js';
import {BehaviorSubject} from 'rxjs';
import {Cliente} from 'Modelos/Interfaces';
import {Roles} from 'Constantes/Roles';


@Injectable({providedIn: 'root'})
export class AuthServicio {
  private supabase: SupabaseClient;
  private rolUsuario = new BehaviorSubject<string | null>(null);
  usuarioRolAction = this.rolUsuario.asObservable();

  constructor() {
    // Inicializa el cliente de supabase con las credenciales.
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
    // Verifica si hay alguna seccion activa.
    this.VerificadorSeccion().catch(console.error);
    this.ObtenerClienteId();
    // Evento para capturar si ocurre algun evento relacionada a ala autenticacion.
    this.supabase.auth.onAuthStateChange((_event, session) => {

      if (session?.user) {
        const role = session.user.user_metadata['role'] as string;
        this.rolUsuario.next(role);
      } else {
        this.rolUsuario.next(null);
      }
    });
  }

  async ObtenerClienteId() {
    const user = await this.supabase.auth.getUser();
    if (user.error) {
      return null;
    } else {
      if (this.rolUsuario.getValue() == Roles.Client) {
        return user.data.user.id;
      } else {
        return null;
      }
    }
  }

  async RegistrarAdmin(email: string, password: string, usuario: string) {
    const result = await this.supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            username: usuario,
            role: Roles.Admin
          }
        }
      }
    );

    return result;
  }

  async RegistrarCliente(cliente: Cliente) {

    const {data, error} = await this.supabase.auth.signUp({
      email: cliente.email,
      password: cliente.Password,
      options: {
        data: {
          role: Roles.Client,
        }
      }
    });
    if (error) {
      return error;
      // notificacion de error
    } else {
      cliente.UserId = data.user?.id ?? "";
      const result = await this.CrearCliente(cliente);
      return result.error;
    }

  }

  private async CrearCliente(cliente: Cliente) {
    const {data, error} = await this.supabase
      .from('Clientes')
      .insert([
        {
          Nombre: cliente.Nombre,
          Apellido: cliente.Apellido,
          Telefono: cliente.Telefono,
          Direccion: cliente.Direccion,
          UserId: cliente.UserId
        },
      ])
      .select()
    return {data, error};
  }

  async ObtenerClienteActual() {
    const user = await this.supabase.auth.getUser();
    const userId = await this.ObtenerClienteId();
    if (userId === null) {
      return {cliente: null, error: "No eres cliente. Inicia seccion."};
    }

    let {data: Clientes, error} = await this.supabase
      .from('Clientes')
      .select('*')
      .eq("UserId ", userId)
      .limit(1) as { data: Cliente[], error: any };
    let datosCliente = Clientes?.[0];
    datosCliente.email = user.data.user?.email ?? "";
    return {cliente: datosCliente, error};

  }

  async VerificadorSeccion() {
    const {data: {session}} = await this.supabase.auth.getSession();
    if (session?.user) {
      const role = session.user.user_metadata['role'] as string;
      this.rolUsuario.next(role);
    } else {
      this.rolUsuario.next(null);
    }
  }

  async Entrar(credenciales: SignInWithPasswordCredentials) {

    const resultado = await this.supabase.auth.signInWithPassword(credenciales);
    if (resultado.data.user) {
      const rol = resultado.data.user.user_metadata['role'] as string;
      this.rolUsuario.next(rol);
    }
    return resultado;
  }


  async CambiarPassword(password: string) {
    const {data, error} = await this.supabase.auth.updateUser({
      password: password
    });

    return error === null ?
      null : error.message === 'New password should be different from the old password.' ?
        'La nueva contraseña debe ser diferente' :
        'Algo salio mal al cambiar la contraseña 📌';


  }

  async CerrarSeccion() {
    this.rolUsuario.next(null);
    return await this.supabase.auth.signOut();
  }

}
