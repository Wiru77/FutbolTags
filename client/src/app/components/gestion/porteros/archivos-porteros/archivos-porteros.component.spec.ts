import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPorterosComponent } from './archivos-porteros.component';

describe('ArchivosPorterosComponent', () => {
  let component: ArchivosPorterosComponent;
  let fixture: ComponentFixture<ArchivosPorterosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosPorterosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosPorterosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
