export interface Cliente {
  Password: string;
  email: string;
  id: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  UserId: string;
  Direccion: string;
  // password: string;
  // email: string;
  // id: string;
  // nombre: string;
  // apellido: string;
  // telefono: string;
  // userId: string;
  // direccion: string;
}

export interface ClientesAdmin {
  id: number
  Nombre: string
  Apellido: string
  Telefono: string
  UserId: string
  Direccion: string
}


export interface MyNotificacion {
  message: string;
  tipo: "bien" | "warning" | "error";

}

export class Membresia {
  id !: number;
  Nombre!: string;
  Descripcion!: string;
  DuracionMeses!: number;
  Precio!: number;
  Activa!: boolean;
  publicoObjectivo!: string;
}

// export  interface Membresia {
//   id: number
//   Nombre: string
//   Descripcion: string
//   DuracionMeses: number
//   Precio: number
//   Activa: boolean
//   publicoObjectivo: string
// }


export interface Suscripcion {
  id: number
  ClienteId: number
  MembresiaId: number
  Inicia: string
  Finaliza: string
  Estatus: string
  Renovante: boolean
  Membresias: Membresia
}

export interface Pago {
  id: number
  SubscripcionId: number
  Monto: number
  Fecha: string
  metodo: string
  Estatus: string
  Suscripciones: {
    id: number,
    Membresias: {
      id: number
      Precio: number
    }
  }
}
