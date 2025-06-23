import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosIntdeportivaComponent } from './archivos-intdeportiva.component';

describe('ArchivosIntdeportivaComponent', () => {
  let component: ArchivosIntdeportivaComponent;
  let fixture: ComponentFixture<ArchivosIntdeportivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosIntdeportivaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosIntdeportivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
