import {Routes} from '@angular/router';
import {AuthRutas} from 'Constantes/Constantes';


const RutasAuth: Routes = [
  {
    path: AuthRutas.RouteLogIn,
    loadComponent: () => import("./login/login.component").then(x => x.LoginComponent)
  },
  {
    path: AuthRutas.RouteSignUp,
    loadComponent: () => import("./sing-up/sing-up.component").then(x => x.SingUpComponent)
  }
  , {
    path: "",
    redirectTo: AuthRutas.LogIn,
    pathMatch: 'full',

  },
  {
    path: '**',
    redirectTo: AuthRutas.RouteLogIn,
    pathMatch: 'full',
  }

];
export default RutasAuth;
