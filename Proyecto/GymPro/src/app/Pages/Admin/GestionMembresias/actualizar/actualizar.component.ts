import {AfterContentInit, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Membresia} from 'Modelos/Interfaces';
import {NotificacionServicio} from 'Servicios/NotificacionServicio';
import {AdministradorServicio} from 'Servicios/AdministradorServicio';

@Component({
  selector: 'app-actualizar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css'
})
export class ActualizarComponent implements AfterContentInit {
  private adminServ = inject(AdministradorServicio);
  private notificar = inject(NotificacionServicio);
  @Input({required: true}) preview!: Membresia;
  @Output() cambios = new EventEmitter<boolean>();
  membresiaForm: FormGroup;
  membresia: Membresia = {
    id: 0,
    Nombre: '',
    Descripcion: '',
    DuracionMeses: 0,
    Precio: 0,
    Activa: false,
    publicoObjectivo: ''
  };

  constructor(private formBuilder: FormBuilder) {
    this.membresiaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      duracionMeses: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      publicoObjectivo: ['', [Validators.required]],
      activa: false,
    });
  }

  ngAfterContentInit(): void {
    // this.membresia = {
    //   id: this.preview.id,
    //   Nombre: this.preview.Nombre,
    //   Descripcion: this.preview.Descripcion,
    //   DuracionMeses: this.preview.DuracionMeses,
    //   Precio: this.preview.Precio,
    //   Activa: this.preview.Activa,
    //   publicoObjectivo: this.preview.publicoObjectivo
    // };
    this.membresiaForm = this.formBuilder.group({
      nombre: [this.preview.Nombre, [Validators.required]],
      descripcion: [this.preview.Descripcion, [Validators.required]],
      duracionMeses: [this.preview.DuracionMeses, [Validators.required, Validators.min(1)]],
      precio: [this.preview.Precio, [Validators.required, Validators.min(0)]],
      publicoObjectivo: [this.preview.publicoObjectivo, [Validators.required]],
      activa: this.preview.Activa,
    });


  }


  get f() {
    return this.membresiaForm.controls;
  }


  async guardarCambios() {

    if (this.membresiaForm.invalid) {
      return;
    }

    const datos = {
      id: 0,
      Activa: this.f['activa'].value,
      Nombre: this.f['nombre'].value,
      Descripcion: this.f['descripcion'].value,
      DuracionMeses: this.f['duracionMeses'].value,
      Precio: this.f['precio'].value,
      publicoObjectivo: this.f['publicoObjectivo'].value
    };
    datos.Descripcion = datos.Descripcion.replaceAll(",", '.');

    if (this.preview.Nombre != datos.Nombre ||
      this.preview.Descripcion!=datos.Descripcion ||
      this.preview.DuracionMeses != datos.Precio ||
      this.preview.Precio != datos.Precio ||
      this.preview.publicoObjectivo != datos.publicoObjectivo ) {

      const result = await this.adminServ.ActualizarMembresia(this.preview.id, datos);
      if (result) {
        this.notificar.NotificarBien("Membresia Actualizada ✅");
        this.cambios.next(true)

      } else {
        this.notificar.NotificarError("Error al actualizar la membresia");
      }
    }else{
      this.notificar.NotificarWarning("Sin cambios realizados.");

    }
  }

  async eliminarMembresia() {
    if (confirm("Seguro que quieres eliminar esta membresia?")) {
      const result = await this.adminServ.eliminarMembresia(this.preview.id);
      if (result) {
        this.notificar.NotificarWarning("Membresia Eliminada ✅");
        this.cambios.next(true)

      } else {
        this.notificar.NotificarError("Error al eliminar la membresia");
      }
    }

  }

}
