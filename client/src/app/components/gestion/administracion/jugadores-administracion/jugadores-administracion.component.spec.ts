import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresAdministracionComponent } from './jugadores-administracion.component';

describe('JugadoresAdministracionComponent', () => {
  let component: JugadoresAdministracionComponent;
  let fixture: ComponentFixture<JugadoresAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresAdministracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
