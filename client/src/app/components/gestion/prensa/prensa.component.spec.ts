import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrensaComponent } from './prensa.component';

describe('PrensaComponent', () => {
  let component: PrensaComponent;
  let fixture: ComponentFixture<PrensaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrensaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrensaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
