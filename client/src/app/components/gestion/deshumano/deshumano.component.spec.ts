import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeshumanoComponent } from './deshumano.component';

describe('DeshumanoComponent', () => {
  let component: DeshumanoComponent;
  let fixture: ComponentFixture<DeshumanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeshumanoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeshumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
