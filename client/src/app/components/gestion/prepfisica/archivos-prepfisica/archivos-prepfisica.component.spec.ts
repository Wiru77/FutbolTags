import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPrepfisicaComponent } from './archivos-prepfisica.component';

describe('ArchivosPrepfisicaComponent', () => {
  let component: ArchivosPrepfisicaComponent;
  let fixture: ComponentFixture<ArchivosPrepfisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosPrepfisicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchivosPrepfisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
