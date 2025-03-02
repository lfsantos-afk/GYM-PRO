import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MyNotificacion} from 'Modelos/Interfaces';


@Injectable({providedIn: 'root'})
export class NotificacionServicio {

  private notificacion: BehaviorSubject<MyNotificacion | null> = new BehaviorSubject<MyNotificacion | null>(null);
  notificacionObservable = this.notificacion.asObservable();


  NotificarError(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "error"});
    setTimeout(() => this.limpiarNotificacion(), 3000);
  }

  NotificarBien(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "bien"});

    setTimeout(() => this.limpiarNotificacion(), 3000);
  }

  NotificarWarning(message: string) {
    this.limpiarNotificacion()
    this.notificacion.next({message, tipo: "warning"});
    setTimeout(() => this.limpiarNotificacion(), 3000);
  }

  limpiarNotificacion() {
    this.notificacion.next(null);
  }

}
