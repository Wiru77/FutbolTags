import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresPartidosComponent } from './jugadores-partidos.component';

describe('JugadoresPartidosComponent', () => {
  let component: JugadoresPartidosComponent;
  let fixture: ComponentFixture<JugadoresPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresPartidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
