import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreamedicaComponent } from './areamedica.component';

describe('AreamedicaComponent', () => {
  let component: AreamedicaComponent;
  let fixture: ComponentFixture<AreamedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreamedicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreamedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
