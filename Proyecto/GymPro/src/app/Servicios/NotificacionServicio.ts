import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MyNotificacion} from 'Modelos/Interfaces';


@Injectable({providedIn: 'root'})
export class NotificacionServicio {

  private notificacion: BehaviorSubject<MyNotificacion | null> = new BehaviorSubject<MyNotificacion | null>(null);
  notificacionObservable = this.notificacion.asObservable();

  // posible mal funcionamiento debido a limpiar al pasar los '5' segundos.
  NotificarError(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "error"});
    setTimeout(() => this.limpiarNotificacion(), 5000);
  }

  NotificarBien(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "bien"});

    setTimeout(() => this.limpiarNotificacion(), 5000);
  }

  NotificarWarning(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "warning"});
    setTimeout(() => this.limpiarNotificacion(), 5000);
  }

  limpiarNotificacion() {
    this.notificacion.next(null);
  }

}
