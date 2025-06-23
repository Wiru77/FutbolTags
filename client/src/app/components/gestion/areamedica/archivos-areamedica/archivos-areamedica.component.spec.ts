import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosAreamedicaComponent } from './archivos-areamedica.component';

describe('ArchivosAreamedicaComponent', () => {
  let component: ArchivosAreamedicaComponent;
  let fixture: ComponentFixture<ArchivosAreamedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosAreamedicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosAreamedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
