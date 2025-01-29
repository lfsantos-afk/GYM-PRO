import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthRutas, Rutas} from 'Constantes/Constantes';
import {AuthServicio} from '../AuthServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected readonly AuthRutas = AuthRutas;

  form!: FormGroup;
  mensaje: string | null = null;

  constructor(private _formBuilder: FormBuilder,
              private authServicio: AuthServicio,
              private router: Router,
              private notificacioServicio: NotificacionServicio) {
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });
  }

  async entrar() {
    if (this.form.invalid) {
      this.form.markAsTouched();
      this.mensaje = "Debe ingresar todos los campos";
      return;
    }

    const result = await this.authServicio.Entrar({
      email: this.form.value.email!,
      password: this.form.value.password!
    });
    if (result.error !== null) {
      if (result.error.code === "invalid_credentials") {
        this.mensaje = "Credenciales incorrectas";
        this.notificacioServicio.NotificarError(this.mensaje);
      } else if (result.error.code === "email_not_confirmed") {
        this.mensaje = "E-mail no confirmado aun. COnfirme su e-mail antes de continuar.";
        this.notificacioServicio.NotificarError(this.mensaje);
      } else if (result.error.code === "request_timeout") {
        this.mensaje = "Esto esta tomando mas tiempo de lo normal. Intentelo nuevamente"
        this.notificacioServicio.NotificarWarning(this.mensaje);
      } else if (result.error.code === "unexpected_failure") {
        this.mensaje = "Algo salio mal de nuestra parte."
        this.notificacioServicio.NotificarWarning(this.mensaje);
      } else {
        this.notificacioServicio.NotificarError("Error al iniciar sección 😞");
      }
    } else {
      this.notificacioServicio.NotificarBien("Session iniciada...");
      await this.router.navigate([Rutas.Inicio]);
    }

  }
}


