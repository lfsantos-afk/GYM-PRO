import {Component} from '@angular/core';
import {AuthServicio} from '../AuthServicio';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthRutas, Rutas, RutasRouting} from 'Constantes/Constantes';


@Component({
  selector: 'app-sign-up-admin',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up-admin.component.html',
  styleUrl: './sign-up-admin.component.css'
})
export class SignUpAdminComponent {
  message: string | null = null;
  Signed = false;
  form!: FormGroup;

  constructor(private _route: Router, private _authService: AuthServicio) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
    });
  }


  async enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const {error} = await this._authService.RegistrarAdmin(this.form.value.email!, this.form.value.password!, this.form.value.nombre!,);
    if (error === null) {
      this.Signed = true;
      this.message = "";
      await this._route.navigate([Rutas.Inicio]); // REEDIRIIR A LOGIN?
    } else {
      if (error.code == "weak_password") {
        this.message = "Passwords is too weak. " + error.message;
      } else if (error.code == "email_not_match") {
        this.message = "Email already in use. " + error.message;
        this.message = error.message;
      } else if (error.code == "email_exists") {
        this.message = "Email already exists.";
        this.message = error.message;
      } else if (error.message == "Failed to fetch") {
        this.message = "Revisa tu conexion antes de intentarlo nuevamente";
      } else {
        console.error("Error manejando el registro de administrador... ", error.code);
        this.message = "Algo paso mal.";
      }
    }
  }
  protected readonly AuthRutas = AuthRutas;
}
