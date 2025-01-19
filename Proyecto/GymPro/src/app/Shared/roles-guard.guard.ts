import {CanActivateFn} from '@angular/router';


export function rolesGuard(rolesPermitidos: string[]): CanActivateFn {
  return (route, state): boolean => {
    return true;
  }
}

// return (route, state): boolean => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   let role = "";
//   let seguir = false;
//
//   authService.userRole$.subscribe(userRole => {
//     role = userRole ?? '';
//   })
//   if (route.routeConfig?.path === "auth" && role !== "") {
//     return false;
//   } else if (route.routeConfig?.path === "auth" && role === "") {
//     return true;
//   }
//
//
//
//   seguir = rolesPermitidos.includes(role);
//   if (!seguir) {
//     router.navigate([RutasPaginas.AccesoDenegado]).then(x => true);
//   }
//   return seguir;
// }
