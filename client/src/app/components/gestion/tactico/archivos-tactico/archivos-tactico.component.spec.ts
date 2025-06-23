import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosTacticoComponent } from './archivos-tactico.component';

describe('ArchivosTacticoComponent', () => {
  let component: ArchivosTacticoComponent;
  let fixture: ComponentFixture<ArchivosTacticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosTacticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosTacticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
