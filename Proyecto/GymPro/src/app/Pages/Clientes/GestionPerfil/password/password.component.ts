import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {AuthServicio} from '../../../../Auth/AuthServicio';

@Component({
  selector: 'app-password',
  imports: [
    FormsModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  @Output() volver = new EventEmitter<boolean>();
  private notificar = inject(NotificacionServicio);
  private authServ = inject(AuthServicio);

  formulario = {
    newPassword: '',
    confirmPassword: ''
  };


  async Cambiar() {
    const resultado = await this.authServ.CambiarPassword(this.formulario.newPassword);
    if (resultado === null) {
      this.notificar.NotificarBien("Contraseña cambiada✅");
      this.cancelar();
    } else {
      this.notificar.NotificarWarning(resultado);
    }
  }

  cancelar() {
    this.volver.next(true);
  }
}
