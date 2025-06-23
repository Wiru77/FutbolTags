import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntdeportivaComponent } from './intdeportiva.component';

describe('IntdeportivaComponent', () => {
  let component: IntdeportivaComponent;
  let fixture: ComponentFixture<IntdeportivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntdeportivaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntdeportivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
