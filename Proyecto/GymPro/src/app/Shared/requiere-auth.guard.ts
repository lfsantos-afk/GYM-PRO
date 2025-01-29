import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthServicio} from '../Auth/AuthServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {AuthRutas} from 'Constantes/Constantes';

export const requiereAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServicio);
  const router = inject(Router);
  const notificacion = inject(NotificacionServicio);
  let role = "";


  authService.usuarioRolAction.subscribe(userRole => {
    role = userRole ?? '';
  })
  if (role == "") {
    notificacion.NotificarWarning("Necesitas iniciar sección.");
    router.navigate([AuthRutas.LogIn]);
    return false;
  } else {
    return true;
  }
};
