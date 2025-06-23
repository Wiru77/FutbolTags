import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPrensaComponent } from './archivos-prensa.component';

describe('ArchivosPrensaComponent', () => {
  let component: ArchivosPrensaComponent;
  let fixture: ComponentFixture<ArchivosPrensaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosPrensaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosPrensaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
