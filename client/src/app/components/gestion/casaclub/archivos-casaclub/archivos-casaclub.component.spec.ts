import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosCasaclubComponent } from './archivos-casaclub.component';

describe('ArchivosCasaclubComponent', () => {
  let component: ArchivosCasaclubComponent;
  let fixture: ComponentFixture<ArchivosCasaclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosCasaclubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosCasaclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
