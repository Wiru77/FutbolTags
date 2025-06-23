import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorterosComponent } from './porteros.component';

describe('PorterosComponent', () => {
  let component: PorterosComponent;
  let fixture: ComponentFixture<PorterosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorterosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PorterosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
