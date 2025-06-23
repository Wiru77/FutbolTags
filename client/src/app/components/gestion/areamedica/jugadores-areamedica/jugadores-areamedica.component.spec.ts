import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresAreamedicaComponent } from './jugadores-areamedica.component';

describe('JugadoresAreamedicaComponent', () => {
  let component: JugadoresAreamedicaComponent;
  let fixture: ComponentFixture<JugadoresAreamedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresAreamedicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresAreamedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
