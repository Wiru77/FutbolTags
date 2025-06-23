import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosDeshumanoComponent } from './archivos-deshumano.component';

describe('ArchivosDeshumanoComponent', () => {
  let component: ArchivosDeshumanoComponent;
  let fixture: ComponentFixture<ArchivosDeshumanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosDeshumanoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosDeshumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
