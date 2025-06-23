import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresPrepfisicaComponent } from './jugadores-prepfisica.component';

describe('JugadoresPrepfisicaComponent', () => {
  let component: JugadoresPrepfisicaComponent;
  let fixture: ComponentFixture<JugadoresPrepfisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresPrepfisicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresPrepfisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
