import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtileriaComponent } from './utileria.component';

describe('UtileriaComponent', () => {
  let component: UtileriaComponent;
  let fixture: ComponentFixture<UtileriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtileriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtileriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
