import {Component, OnInit} from '@angular/core';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {MyNotificacion} from 'Modelos/Interfaces';

@Component({
  selector: 'app-notificacion',
  imports: [],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent implements OnInit {

  Notificacion: MyNotificacion | null = null;

  constructor(private ServicioNotificacion: NotificacionServicio) {}

  ngOnInit() {
    this.ServicioNotificacion.notificacionObservable.subscribe(notificacion => {
      this.Notificacion = notificacion;
    })
  }


}
