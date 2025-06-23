import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosVisoriasComponent } from './archivos-visorias.component';

describe('ArchivosVisoriasComponent', () => {
  let component: ArchivosVisoriasComponent;
  let fixture: ComponentFixture<ArchivosVisoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosVisoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosVisoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
