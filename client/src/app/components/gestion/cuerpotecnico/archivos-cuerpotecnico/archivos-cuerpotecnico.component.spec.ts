import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosCuerpotecnicoComponent } from './archivos-cuerpotecnico.component';

describe('ArchivosCuerpotecnicoComponent', () => {
  let component: ArchivosCuerpotecnicoComponent;
  let fixture: ComponentFixture<ArchivosCuerpotecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosCuerpotecnicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosCuerpotecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
