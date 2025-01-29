import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MenuComponent} from './Shared/menu/menu.component';
import {NotificacionComponent} from './Shared/notificacion/notificacion.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, NotificacionComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
