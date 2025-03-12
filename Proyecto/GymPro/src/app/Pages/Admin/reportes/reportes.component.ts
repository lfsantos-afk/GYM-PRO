import {Component, inject, OnInit} from '@angular/core';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';
import {Roles} from 'Constantes/Roles';
import {Rutas} from 'Constantes/Constantes';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {FechaContador, GrupoMembresia, ReporteSuscripciones} from 'Modelos/Reportes';


@Component({
  selector: 'app-reportes',
  imports: [ChartModule, TableModule, CurrencyPipe,DecimalPipe],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  private adminServicio = inject(AdministradorServicio);

  EstadoSuscripciones: any;
  OptionsEstadoSuscripciones: any;
  SuscripcionesMensuales: any;
  OptionSuscripcionesSemanales: any;

  radarOptions: any;
  radarData: any;
  private paletaColores = [
    'rgba(255, 85, 85, 0.7)',
    'rgba(60, 120, 255, 0.75)',
    'rgba(155, 80, 250, 0.7)',
    'rgba(20, 200, 120, 0.65)',

    'rgba(255, 220, 0, 0.65)',
    'rgba(255, 140, 0, 0.7)',
    'rgba(0, 180, 235, 0.7)',
    'rgba(230, 80, 190, 0.65)',
    'rgba(40, 180, 100, 0.7)',
    'rgba(80, 70, 220, 0.75)'
  ];


  datos: {
    TotalPagado: number;
    pagosMensuales: { monto: number; fecha: string }[];
    suscripcionesMensuales: GrupoMembresia[];
    suscripcionesPorEstado: { cantidad: number; nombre: string }[];
    totalSuscripciones: number;
    totalClientes: number
  } = {
    TotalPagado: 0,
    pagosMensuales: [],
    suscripcionesMensuales: [],
    suscripcionesPorEstado: [],
    totalSuscripciones: 0,
    totalClientes: 0
  };


  async ngOnInit() {
    this.datos = await this.adminServicio.ObtenerReportes();
    this.prepararGraficoSuscripciones();
    await this.CargarGraficos();
  }


  async CargarGraficos() {

    this.OptionsEstadoSuscripciones = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return ` ${tooltipItem.label}: ${tooltipItem.raw}%`;
            }
          }
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold'
          },
          backgroundColor: [this.paletaColores]
            ,
          formatter: (value: any) => {
            return value + '%';
          }
        }
      },
      cutout: '70%',
      borderWidth: 0
    };



    this.EstadoSuscripciones = {
      labels: this.datos.suscripcionesPorEstado.map((x => x.nombre)),
      datasets: [{
        label: this.datos.suscripcionesPorEstado.map((x) => x.nombre),
        data: this.datos.suscripcionesPorEstado.map((x) => x.cantidad),
        backgroundColor: [this.obtenerColor(1),this.obtenerColor(2),this.obtenerColor(3),this.obtenerColor(4),this.obtenerColor(5)]

      }]
    }


    this.radarData = {
      labels: ['Adquisición', 'Retención', 'Renovación', 'Crecimiento', 'Cancelación'],
      datasets: [
        {
          label: 'Este mes',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          data: [85, 75, 70, 80, 20]
        },
        {
          label: 'Mes anterior',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          data: [80, 78, 68, 75, 25]
        }
      ]
    };
    this.radarOptions = {
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          pointLabels: {
            color: '#ffffff'
          },
          ticks: {
            backdropColor: 'transparent',
            color: '#ffffff'
          }
        }
      }
    };
  }


  protected readonly Roles = Roles;
  protected readonly Rutas = Rutas;

  private prepararGraficoSuscripciones() {
    const todasLasFechas = new Set<string>();
    const datosAgrupados = this.datos.suscripcionesMensuales;
    Object.values(datosAgrupados).forEach((membresia: any) => {
      membresia.fechas.forEach((item: any) => {
        todasLasFechas.add(item.fecha);
      });
    });

    const fechasOrdenadas = Array.from(todasLasFechas).sort();


    const datasets = Object.values(datosAgrupados).map((membresia: any, index) => {

      const fechaMap = membresia.fechas.reduce((map: any, item: any) => {
        map[item.fecha] = item.cantidad;
        return map;
      }, {});


      const data = fechasOrdenadas.map(fecha => fechaMap[fecha] || 0);

      return {
        label: membresia.nombre,
        data: data,
        fill: false,
        borderColor: this.obtenerColor(index),
        tension: 0.4
      };

    });

    this.SuscripcionesMensuales = {
      labels: fechasOrdenadas,
      datasets: datasets
    };

    this.OptionSuscripcionesSemanales = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Suscripciones por Membresía'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Cantidad'
          },
          beginAtZero: true
        }
      }
    };
  }

  private obtenerColor(index: number = -1) {
    if (index === -1) {
      index = Math.floor(Math.random() * (this.paletaColores.length + 1) * Math.random() * 9);
    }

    return this.paletaColores[(index > this.paletaColores.length - 1 || index < 0 ? 0 : index)];
  }

  CalcularPorcientoSuscripciones(cantidad: number) {
    const total = this.datos.suscripcionesPorEstado.reduce((t, n) => {
      return n.cantidad + t;
    }, 0);
    return (cantidad * 100) / total;
  }

}
