import {Routes} from '@angular/router';
import {RutasRouting} from 'Constantes/Constantes';


const ClientesRouting: Routes = [
  {
    path: RutasRouting.RouteClientesHistorial,
    loadComponent: () => import('./historial/historial.component').then(x => x.HistorialComponent),
  },
  {
    path: RutasRouting.RouteAdquirirSuscripcion,
    loadComponent: () => import("./crear-suscripcion/crear-suscripcion.component").then(x => x.CrearSuscripcionComponent),
  },
  {
    path: "pagar/:id",
    loadComponent: () => import("./pagar/pagar.component").then(x => x.PagarComponent),
  },
  {
    path: '',
    redirectTo: RutasRouting.RouteClientesHistorial,
    pathMatch: 'full',
  }
]
export default ClientesRouting;
