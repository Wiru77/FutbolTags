import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticoComponent } from './tactico.component';

describe('TacticoComponent', () => {
  let component: TacticoComponent;
  let fixture: ComponentFixture<TacticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TacticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
