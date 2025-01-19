import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Rutas, AuthRutas} from 'Constantes/Constantes';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  role : string | null = null;

  protected readonly Rutas = Rutas;
  MenuAbierto: boolean = false;

  BotonMenu() {
    this.MenuAbierto =!this.MenuAbierto;
  }

  async btnLogin() {
    // if (this.role !== null) {
    //   const result = await this.authServicio.signOut();
    //   if (result) {
    //     await this.router.navigate([AuthPaths.LogIn]);
    //   }
    // } else {
    //   // redirigir al login
    //   await this.router.navigate([AuthPaths.LogIn]);
    // }
    console.log(this.MenuAbierto);
  }
}
