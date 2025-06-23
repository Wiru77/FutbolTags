import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresSecretecnicaComponent } from './jugadores-secretecnica.component';

describe('JugadoresSecretecnicaComponent', () => {
  let component: JugadoresSecretecnicaComponent;
  let fixture: ComponentFixture<JugadoresSecretecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresSecretecnicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresSecretecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
