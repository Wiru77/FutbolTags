import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosFisioterapiaComponent } from './archivos-fisioterapia.component';

describe('ArchivosFisioterapiaComponent', () => {
  let component: ArchivosFisioterapiaComponent;
  let fixture: ComponentFixture<ArchivosFisioterapiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosFisioterapiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosFisioterapiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
