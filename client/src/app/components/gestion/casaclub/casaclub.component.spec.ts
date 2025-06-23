import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasaclubComponent } from './casaclub.component';

describe('CasaclubComponent', () => {
  let component: CasaclubComponent;
  let fixture: ComponentFixture<CasaclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasaclubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasaclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
