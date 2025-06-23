import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosCategoriasComponent } from './archivos-categorias.component';

describe('ArchivosCategoriasComponent', () => {
  let component: ArchivosCategoriasComponent;
  let fixture: ComponentFixture<ArchivosCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosCategoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
