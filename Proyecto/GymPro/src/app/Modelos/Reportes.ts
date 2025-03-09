import {Membresia} from 'Modelos/Interfaces';
export interface FechaContador {
  fecha: string;
  cantidad: number;
}

// export interface ReporteSuscripciones {
//   [nombreMembresia: string]: FechaContador[];
// }
export interface SuscripcionesReportes {
  id: number
  ClienteId: number
  MembresiaId: number
  Inicia: string
  Finaliza: string
  Estatus: string
  Renovante: boolean
  Membresias: Membresia
  Clientes: Cliente
}


export interface FechaContador {
  fecha: string;
  cantidad: number;
}

export interface GrupoMembresia {
  nombre: string;
  fechas: FechaContador[];
}

export interface ReporteSuscripciones {
  [nombreMembresia: string]: GrupoMembresia;
}

export interface Cliente {
  id: number
  Nombre: string
  UserId: string
  Apellido: string
  Telefono: string
  Direccion: string
}
