import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresUtileriaComponent } from './jugadores-utileria.component';

describe('JugadoresUtileriaComponent', () => {
  let component: JugadoresUtileriaComponent;
  let fixture: ComponentFixture<JugadoresUtileriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresUtileriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresUtileriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
