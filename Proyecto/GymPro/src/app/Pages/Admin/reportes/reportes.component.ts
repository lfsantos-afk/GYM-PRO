import {Component, OnInit} from '@angular/core';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';
import {groupBy} from 'rxjs';
import {Suscripcion} from 'Modelos/Interfaces';
import {Roles} from 'Constantes/Roles';
import {Rutas} from 'Constantes/Constantes';


interface MembresiasDatos {
  membresia: {
    id: number;
    Activa: boolean;
    Nombre: string;
    Precio: number;
    Descripcion: string;
    DuracionMeses: number;
    publicoObjectivo: string;
  };
  cantidad: number;
}

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  datos: MembresiasDatos[] = [];

  constructor(private adminServicio: AdministradorServicio) {
  }

  async ngOnInit() {
    await this.ObtenerSuscripciones();
  }

  async ObtenerSuscripciones() {
    const result = await this.adminServicio.ObtenerSuscripciones();

    const counts = result.Suscripciones.reduce((acc, membership) => {
      const membresiaId = membership.Membresias.id;

      if (!acc[membresiaId]) {
        acc[membresiaId] = {
          membresia: membership.Membresias,
          cantidad: 0
        };
      }
      acc[membresiaId].cantidad++;
      return acc;
    }, {} as { [key: number]: MembresiasDatos });
    this.datos = Object.values(counts);

  }

  protected readonly Roles = Roles;
  protected readonly Rutas = Rutas;
}
