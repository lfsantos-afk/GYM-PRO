import {Component, inject, OnInit} from '@angular/core';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';
import {Roles} from 'Constantes/Roles';
import {Rutas} from 'Constantes/Constantes';
import {ChartModule} from 'primeng/chart';


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

interface AgrupadasPorEstado {
  estado: string;
  cantidad: number;
}

@Component({
  selector: 'app-reportes',
  imports: [ChartModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  private adminServicio = inject(AdministradorServicio);
  datos: MembresiasDatos[] = [];
  datosReporte: any;

  opcionesReporte: any;


  async ngOnInit() {
    await this.ObtenerSuscripciones();

    this.formatearDatosReportes();

  }

  formatearDatosReportes() {
    this.datosReporte = {
      labels: this.datos.map(x => x.membresia.Nombre),
      datasets: [
        {
          label: 'Activas',
          data: this.datos.map(x => x.cantidad),
          backgroundColor: ["#F87171", "#FACC15", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FDBA74", "#2DD4BF", "#FB923C", "#4ADE80"],
          borderColor: ["#000"]

        }, {
          label: 'Pasadas',
          data: this.datos.filter(x => !x.membresia.Activa).map(x => x.cantidad),
          backgroundColor: ["#47ff0b",
            "#FACC15"],

          borderColor: ["#e8dc1c"]
        }
      ]
    };

    this.opcionesReporte = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        },
      },
    }


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

  IrMembresia($event: any) {
    console.info($event);

  }
}
