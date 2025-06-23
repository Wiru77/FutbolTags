import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresNutricionComponent } from './jugadores-nutricion.component';

describe('JugadoresNutricionComponent', () => {
  let component: JugadoresNutricionComponent;
  let fixture: ComponentFixture<JugadoresNutricionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresNutricionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresNutricionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
