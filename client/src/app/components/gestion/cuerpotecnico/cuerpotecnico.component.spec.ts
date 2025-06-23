import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuerpotecnicoComponent } from './cuerpotecnico.component';

describe('CuerpotecnicoComponent', () => {
  let component: CuerpotecnicoComponent;
  let fixture: ComponentFixture<CuerpotecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuerpotecnicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CuerpotecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
