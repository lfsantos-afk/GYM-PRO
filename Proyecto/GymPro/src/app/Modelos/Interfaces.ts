export interface Cliente {
  password: string;
  email: string;
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  userId: string;
  direccion: string;
}


export interface MyNotificacion {
  message: string;
  tipo : "bien" | "warning" | "error";

}
export  interface Membresia {
  id: number
  Nombre: string
  Descripcion: string
  DuracionMeses: number
  Precio: number
  Activa: boolean
  publicoObjectivo: string
}
