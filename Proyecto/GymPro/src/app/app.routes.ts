import {Routes} from '@angular/router';
import {rolesGuard} from './Shared/roles-guard.guard';
import {Roles} from 'Constantes/Roles';
import {Rutas, RutasRouting} from 'Constantes/Constantes';
import {requiereAuthGuard} from './Shared/requiere-auth.guard';

export const routes: Routes = [


  {
    path: 'auth',
    canActivate: [rolesGuard([Roles.Admin, Roles.Client])],
    loadChildren: () => import('./Auth/AuthRouting')
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
    path: RutasRouting.RouteMembresias + "/:id",
    loadComponent: () => import("./Pages/membresia-detalles/membresia-detalles.component").then(m => m.MembresiaDetallesComponent),
  },
  {
    path: RutasRouting.RouteAdquirirSuscripcion,
    canActivate: [requiereAuthGuard,rolesGuard([Roles.Client])],
    loadComponent: () => import("./Pages/Clientes/crear-suscripcion/crear-suscripcion.component").then(m => m.CrearSuscripcionComponent),
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
    path: Rutas.AccesoDenegado,
    loadComponent: () => import('./Shared/no-permiso/no-permiso.component').then(d => d.NoPermisoComponent)
  },
  {
    path: Rutas.NoEncontrado,
    loadComponent: () => import('./Shared/no-encontrado/no-encontrado.component').then(m => m.NoEncontradoComponent)
  },
  {
    path: "",
    redirectTo: Rutas.Inicio,
    pathMatch: 'full'
  },
  {
    path: "**",
    redirectTo: Rutas.NoEncontrado,
    pathMatch: "full",
  }
];
