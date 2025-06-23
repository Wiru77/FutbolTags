import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadoresCasaclubComponent } from './jugadores-casaclub.component';

describe('JugadoresCasaclubComponent', () => {
  let component: JugadoresCasaclubComponent;
  let fixture: ComponentFixture<JugadoresCasaclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresCasaclubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JugadoresCasaclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
