import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {AuthRutas, Rutas, RutasRouting} from 'Constantes/Constantes';
import {Router, RouterLink} from '@angular/router';
import {AuthServicio} from '../AuthServicio';
import {Cliente} from 'Modelos/Interfaces';

@Component({
  selector: 'app-sing-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.css'
})
export class SingUpComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private notificacionServ: NotificacionServicio,
              private serv: AuthServicio,
              private router: Router) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', Validators.required],
    });
  }

  async Registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificacionServ.NotificarWarning("LLena todos los campos de manera adecuada.");
      return;
    }
    const cliente: Cliente = {
      password: this.form.get("password")?.value,
      email: this.form.get("email")?.value,
      nombre: this.form.get("nombre")?.value,
      apellido: this.form.get("apellido")?.value,
      telefono: this.form.get("telefono")?.value,
      direccion: this.form.get("direccion")?.value,
      id: "0",
      userId: ""
    }
    const r = await this.serv.RegistrarCliente(cliente);
    if (r == null) {
      this.notificacionServ.NotificarBien("Registro exitoso :)");
      this.router.navigate([Rutas.Membresias]);
    } else {
      this.notificacionServ.NotificarError(`Registro fallo... ${r.message}`);
    }

  }

  protected readonly AuthRutas = AuthRutas;
  protected readonly RutasRouting = RutasRouting;
}
