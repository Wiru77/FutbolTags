import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresCategoriasComponent } from './jugadores-categorias.component';

describe('JugadoresCategoriasComponent', () => {
  let component: JugadoresCategoriasComponent;
  let fixture: ComponentFixture<JugadoresCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresCategoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
