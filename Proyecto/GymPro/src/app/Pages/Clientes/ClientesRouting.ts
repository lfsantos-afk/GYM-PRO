import {Routes} from '@angular/router';
import {RutasRouting} from 'Constantes/Constantes';


const ClientesRouting: Routes = [
  {
    path: RutasRouting.RouteClientesHistorial,
    loadComponent: () => import('./historial/historial.component').then(x => x.HistorialComponent),
  },
  {
    path: '',
    redirectTo: RutasRouting.RouteClientesHistorial,
    pathMatch: 'full',
  }
]
export default ClientesRouting;
