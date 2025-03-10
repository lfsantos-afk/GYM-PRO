import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from './Shared/menu/menu.component';
import {NotificacionComponent} from './Shared/notificacion/notificacion.component';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, NotificacionComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private adminServ = inject(AdministradorServicio);

  async ngOnInit() {
    this.adminServ.ChequearSuscriVencidas();
  }

}
