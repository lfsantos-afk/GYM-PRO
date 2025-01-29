import {Component, OnInit} from '@angular/core';
import {Membresia} from 'Modelos/Interfaces';
import {MembresiaServicio} from 'Servicios/MembresiaServicio';
import {ActivatedRoute, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-membresia-detalles',
  imports: [],
  templateUrl: './membresia-detalles.component.html',
  styleUrl: './membresia-detalles.component.css'
})
export class MembresiaDetallesComponent implements OnInit {
  membresia: Membresia | null = null;
  idMembresia: string;

  constructor(private servMembresia: MembresiaServicio, private ruta: ActivatedRoute) {
    this.idMembresia = this.ruta.snapshot.params["id"];
  }

  async ngOnInit() {
    const r = await this.servMembresia.ObtenerMembresiaById(this.idMembresia);
    this.membresia = r.membresia ?? null;

  }

  ObtenerTiempoMembresia() {

    if (this.membresia) {

      let result = "mensual";
      if (this.membresia.DuracionMeses == 1) {
        result = "mensual";
      } else if (this.membresia.DuracionMeses == 3) {
        result = "trimestral";
      } else if (this.membresia.DuracionMeses == 6) {
        result = "semestral";
      } else if (this.membresia.DuracionMeses == 12) {
        result = "anual";
      } else {
        result = this.membresia.DuracionMeses + " Meses";
      }
      return result;

    } else {
      return "";
    }
  }
}
