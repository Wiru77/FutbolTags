import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosSecretecnicaComponent } from './archivos-secretecnica.component';

describe('ArchivosSecretecnicaComponent', () => {
  let component: ArchivosSecretecnicaComponent;
  let fixture: ComponentFixture<ArchivosSecretecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosSecretecnicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosSecretecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
