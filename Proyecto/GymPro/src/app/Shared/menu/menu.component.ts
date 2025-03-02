import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Rutas, AuthRutas} from 'Constantes/Constantes';
import {AuthServicio} from '../../Auth/AuthServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {Roles} from 'Constantes/Roles';
import {Cliente} from 'Modelos/Interfaces';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private authServicio = inject(AuthServicio);
  private router = inject(Router);
  private notificacionServicio = inject(NotificacionServicio);
  role: string | null = null;

  MenuAbierto: boolean = false;
  clienteActual: Cliente | null = null;

  constructor() {
    this.authServicio.usuarioRolAction.subscribe(usuario =>
      this.role = usuario
    );
    this.authServicio.ObtenerClienteActual().then(x => {
      this.clienteActual = x.cliente;
    })
  }

  async ngOnInit() {
    const resultClienteActual = await this.authServicio.ObtenerClienteActual();
    this.clienteActual = resultClienteActual.cliente;
  }

  userMenuOpen: boolean = false;


  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
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

  protected readonly Rutas = Rutas;

  protected readonly Roles = Roles;

}
