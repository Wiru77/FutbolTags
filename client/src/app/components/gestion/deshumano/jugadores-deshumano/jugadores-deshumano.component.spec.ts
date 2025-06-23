import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresDeshumanoComponent } from './jugadores-deshumano.component';

describe('JugadoresDeshumanoComponent', () => {
  let component: JugadoresDeshumanoComponent;
  let fixture: ComponentFixture<JugadoresDeshumanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresDeshumanoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresDeshumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
