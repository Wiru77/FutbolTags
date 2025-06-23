import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresIntdeportivaComponent } from './jugadores-intdeportiva.component';

describe('JugadoresIntdeportivaComponent', () => {
  let component: JugadoresIntdeportivaComponent;
  let fixture: ComponentFixture<JugadoresIntdeportivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresIntdeportivaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresIntdeportivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
