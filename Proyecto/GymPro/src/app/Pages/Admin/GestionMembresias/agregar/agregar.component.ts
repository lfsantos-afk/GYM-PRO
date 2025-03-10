import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Membresia} from 'Modelos/Interfaces';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';

@Component({
  selector: 'app-agregar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  private adminServ = inject(AdministradorServicio);
  private notificar = inject(NotificacionServicio);
  @Output() cambios = new EventEmitter<boolean>();
  membresiaForm: FormGroup;
  preview: Membresia = {
    id: 0,
    Nombre: '',
    Descripcion: '',
    DuracionMeses: 0,
    Precio: 0,
    Activa: false,
    publicoObjectivo: ''
  };
  beneficiosList: string[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.membresiaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      duracionMeses: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      publicoObjectivo: ['', [Validators.required]]
    });
  }

  get f() {
    return this.membresiaForm.controls;
  }

  async btnAgregar() {
    if (this.membresiaForm.invalid) {
      return;
    }

    this.preview = {
      id: 0,
      Activa: true,
      Nombre: this.f['nombre'].value,
      Descripcion: this.beneficiosList.join('.'),
      DuracionMeses: this.f['duracionMeses'].value,
      Precio: this.f['precio'].value,
      publicoObjectivo: this.f['publicoObjectivo'].value
    };
    const result = await this.adminServ.AgregarMembresia(this.preview);
    if (result) {
      this.notificar.NotificarBien("Membresia registrada ✅");
      this.cambios.next(true)

    } else {
      this.notificar.NotificarError("Error al registrar la membresia");
    }
    this.resetForm();
  }

  resetForm() {
    this.membresiaForm.reset({
      nombre: '',
      descripcion: '',
      duracionMeses: 1,
      precio: 0,
      publicoObjectivo: ''
    });
  }

  ActualizarPreview() {
    this.preview = {
      id: 0,
      Activa: true,
      Nombre: this.f['nombre'].value,
      Descripcion: this.f['descripcion'].value,
      DuracionMeses: this.f['duracionMeses'].value,
      Precio: this.f['precio'].value,
      publicoObjectivo: this.f['publicoObjectivo'].value
    };
    this.beneficiosList = this.preview.Descripcion.split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
  }
}
