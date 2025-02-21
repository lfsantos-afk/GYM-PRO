import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Rutas, AuthRutas} from 'Constantes/Constantes';
import {AuthServicio} from '../../Auth/AuthServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Roles} from 'Constantes/Roles';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  role: string | null = null;

  protected readonly Rutas = Rutas;
  MenuAbierto: boolean = false;
  protected  readonly  Roles = Roles;

  constructor(private authServicio: AuthServicio,
              private router: Router,
              private notificacionServicio: NotificacionServicio) {
    this.authServicio.usuarioRolAction.subscribe(usuario =>
      this.role = usuario
    );
  }

  BotonMenu() {
    this.MenuAbierto = !this.MenuAbierto;
  }

  async btnLogin() {
    if (this.role !== null) {
      const result = await this.authServicio.CerrarSeccion();
      if (result) {
        this.notificacionServicio.NotificarWarning("Seccion cerrada.")
        await this.router.navigate([AuthRutas.LogIn]);
      } else {
        this.notificacionServicio.NotificarBien("Error al cerrar seccion");
      }
    } else {
      await this.router.navigate([AuthRutas.LogIn]);
    }
  }
}
