import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPsicologiaComponent } from './archivos-psicologia.component';

describe('ArchivosPsicologiaComponent', () => {
  let component: ArchivosPsicologiaComponent;
  let fixture: ComponentFixture<ArchivosPsicologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosPsicologiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosPsicologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
