import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthServicio} from '../Auth/AuthServicio';
import {Rutas} from 'Constantes/Constantes';


export function rolesGuard(rolesPermitidos: string[]): CanActivateFn {
  return (route, state): boolean => {
    const authService = inject(AuthServicio);
    const router = inject(Router);
    let role = "";
    let seguir = false;

    authService.usuarioRolAction.subscribe(userRole => {
      role = userRole ?? '';
    })
    if (route.routeConfig?.path === "auth" && role !== "") {
      return false;
    } else if (route.routeConfig?.path === "auth" && role === "") {
      return true;
    }

    seguir = rolesPermitidos.includes(role);
    if (!seguir) {
      router.navigate([Rutas.AccesoDenegado]).then(x => true);
    }
    return seguir;
  }
}
