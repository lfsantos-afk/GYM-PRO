import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPermisoComponent } from './no-permiso.component';

describe('NoPermisoComponent', () => {
  let component: NoPermisoComponent;
  let fixture: ComponentFixture<NoPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPermisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
