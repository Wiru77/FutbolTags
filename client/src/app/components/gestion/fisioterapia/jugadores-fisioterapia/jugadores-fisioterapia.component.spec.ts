import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresFisioterapiaComponent } from './jugadores-fisioterapia.component';

describe('JugadoresFisioterapiaComponent', () => {
  let component: JugadoresFisioterapiaComponent;
  let fixture: ComponentFixture<JugadoresFisioterapiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresFisioterapiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresFisioterapiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
