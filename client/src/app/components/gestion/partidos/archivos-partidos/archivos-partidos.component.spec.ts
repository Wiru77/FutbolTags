import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPartidosComponent } from './archivos-partidos.component';

describe('ArchivosPartidosComponent', () => {
  let component: ArchivosPartidosComponent;
  let fixture: ComponentFixture<ArchivosPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosPartidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
