import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosAdministracionComponent } from './archivos-administracion.component';

describe('ArchivosAdministracionComponent', () => {
  let component: ArchivosAdministracionComponent;
  let fixture: ComponentFixture<ArchivosAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosAdministracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
