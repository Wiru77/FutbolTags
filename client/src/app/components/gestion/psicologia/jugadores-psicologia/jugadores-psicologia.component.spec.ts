import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresPsicologiaComponent } from './jugadores-psicologia.component';

describe('JugadoresPsicologiaComponent', () => {
  let component: JugadoresPsicologiaComponent;
  let fixture: ComponentFixture<JugadoresPsicologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresPsicologiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresPsicologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
