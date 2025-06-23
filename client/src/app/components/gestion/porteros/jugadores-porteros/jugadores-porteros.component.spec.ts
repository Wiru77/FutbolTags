import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresPorterosComponent } from './jugadores-porteros.component';

describe('JugadoresPorterosComponent', () => {
  let component: JugadoresPorterosComponent;
  let fixture: ComponentFixture<JugadoresPorterosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresPorterosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresPorterosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
