import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisoriasComponent } from './visorias.component';

describe('VisoriasComponent', () => {
  let component: VisoriasComponent;
  let fixture: ComponentFixture<VisoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
