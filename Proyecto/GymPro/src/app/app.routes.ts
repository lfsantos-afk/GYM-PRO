import {Routes} from '@angular/router';
import {rolesGuard} from './Shared/roles-guard.guard';
import {Roles} from 'Constantes/Roles';
import {Rutas, RutasRouting} from 'Constantes/Constantes';

export const routes: Routes = [


  {
    path: 'auth',
    canActivate: [rolesGuard([Roles.Admin, Roles.Client])],
    loadChildren: () => import('./Auth/AuthRouting')
  },
  {
    path: RutasRouting.RouteAdmin,
    canActivate: [rolesGuard([Roles.Admin])],
    loadChildren: () => import('./Pages/Admin/AdminRouting')
  },
  {
    path: RutasRouting.RouteCliente,
    canActivate: [rolesGuard([Roles.Client])],
    loadChildren: () => import('./Pages/Clientes/ClientesRouting')
  },
  {
    path: RutasRouting.RouteInicio,
    loadComponent: () => import('./Pages/inicio/inicio.component').then(m => m.InicioComponent),
  },
  {
    path: RutasRouting.RouteMembresias,
    loadComponent: () => import('./Pages/membresias/membresias.component').then(m => m.MembresiasComponent),
  },
  {
    path: Rutas.AccesoDenegado,
    loadComponent: () => import('./Shared/no-permiso/no-permiso.component').then(d => d.NoPermisoComponent)
  },
  {
    path: Rutas.NoEncontrado,
    loadComponent: () => import('./Shared/no-encontrado/no-encontrado.component').then(m => m.NoEncontradoComponent)
  },
  {
    path : "**",
    redirectTo: Rutas.NoEncontrado,
    pathMatch: "full",
  }
];
