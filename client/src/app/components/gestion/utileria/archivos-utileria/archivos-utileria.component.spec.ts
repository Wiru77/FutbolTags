import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosUtileriaComponent } from './archivos-utileria.component';

describe('ArchivosUtileriaComponent', () => {
  let component: ArchivosUtileriaComponent;
  let fixture: ComponentFixture<ArchivosUtileriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosUtileriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosUtileriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
