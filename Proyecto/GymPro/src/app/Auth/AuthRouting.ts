import {Routes} from '@angular/router';
import {AuthRutas} from 'Constantes/Constantes';


const RutasDeAuthenticacion: Routes = [
  {
    path: AuthRutas.RouteLogIn,
    loadComponent: () => import("./login/login.component").then(x => x.LoginComponent)
  },
  {
    path: AuthRutas.RouteSignUp,
    loadComponent: () => import("./sing-up/sing-up.component").then(x => x.SingUpComponent)
  }
  , {
    path: AuthRutas.RouteSignUpAdmin,
    loadComponent: () => import("./sign-up-admin/sign-up-admin.component").then(x => x.SignUpAdminComponent)
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
export default RutasDeAuthenticacion;
