import {RutasRouting} from 'Constantes/Constantes';
import {Routes} from '@angular/router';

const routeAdmin: Routes = [

  {
    path: RutasRouting.RouteClientesAdmin,
    loadComponent: () => import('./clientes/clientes.component').then(c => c.ClientesComponent)
  },
  {
    path: RutasRouting.RouteReportes,
    loadComponent: () => import('./reportes/reportes.component').then(c => c.ReportesComponent)
  },
  {
    path: '',
    redirectTo: RutasRouting.RouteReportes,
    pathMatch: 'full'
  }
]
export default routeAdmin;
