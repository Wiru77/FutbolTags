import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresVisoriasComponent } from './jugadores-visorias.component';

describe('JugadoresVisoriasComponent', () => {
  let component: JugadoresVisoriasComponent;
  let fixture: ComponentFixture<JugadoresVisoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresVisoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresVisoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
