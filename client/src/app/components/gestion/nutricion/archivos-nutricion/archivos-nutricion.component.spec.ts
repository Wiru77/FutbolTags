import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosNutricionComponent } from './archivos-nutricion.component';

describe('ArchivosNutricionComponent', () => {
  let component: ArchivosNutricionComponent;
  let fixture: ComponentFixture<ArchivosNutricionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosNutricionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosNutricionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
