import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresCuerpotecnicoComponent } from './jugadores-cuerpotecnico.component';

describe('JugadoresCuerpotecnicoComponent', () => {
  let component: JugadoresCuerpotecnicoComponent;
  let fixture: ComponentFixture<JugadoresCuerpotecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresCuerpotecnicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresCuerpotecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
