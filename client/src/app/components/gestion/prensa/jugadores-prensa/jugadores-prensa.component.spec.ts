import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresPrensaComponent } from './jugadores-prensa.component';

describe('JugadoresPrensaComponent', () => {
  let component: JugadoresPrensaComponent;
  let fixture: ComponentFixture<JugadoresPrensaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresPrensaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresPrensaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
