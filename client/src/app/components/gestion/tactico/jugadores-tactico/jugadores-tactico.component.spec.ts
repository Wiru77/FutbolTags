import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresTacticoComponent } from './jugadores-tactico.component';

describe('JugadoresTacticoComponent', () => {
  let component: JugadoresTacticoComponent;
  let fixture: ComponentFixture<JugadoresTacticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresTacticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresTacticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
