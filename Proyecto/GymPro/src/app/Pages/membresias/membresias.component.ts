import {Component, OnInit} from '@angular/core';
import {Membresia} from 'Modelos/Interfaces';
import {MembresiaServicio} from 'Servicios/MembresiaServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Rutas} from 'Constantes/Constantes';
import {AuthServicio} from '../../Auth/AuthServicio';
import {Roles} from 'Constantes/Roles';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-membresias',
  imports: [
    RouterLink
  ],
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css'
})
export class MembresiasComponent implements OnInit {
  membresias: Membresia[] = [];
  role: string | null = null;

  constructor(private membresiaServ: MembresiaServicio,
              private NotificacionServ: NotificacionServicio,
              private authServicio: AuthServicio,
              private router: Router,) {
  }

  async ngOnInit() {
    this.authServicio.usuarioRolAction.subscribe(
      role => this.role = role
    );
    const result = await this.membresiaServ.ObtenerMembresias();

    if (result.error === null) {
      this.membresias = result.membresias ?? [];
    } else {
      this.NotificacionServ.NotificarError("Algo salio mal al obtener las membresias");
    }
  }


  ObtenerTiempoMembresia(membresia: Membresia) {

    let result = "mensual";
    if (membresia.DuracionMeses == 1) {
      result = "mensual";
    } else if (membresia.DuracionMeses == 3) {
      result = "trimestral";
    } else if (membresia.DuracionMeses == 6) {
      result = "semestral";
    } else if (membresia.DuracionMeses == 12) {
      result = "anual";
    } else {
      result = membresia.DuracionMeses + " Meses";
    }
    return result;
  }

  IrComprar(id: number) {
    this.router.navigate([Rutas.AdquirirSuscripcion,id.toString()]);
    //this.router.navigate(["/membresias/comprar",id.toString()]);
  }

  protected readonly Rutas = Rutas;
  protected readonly Roles = Roles;


}
