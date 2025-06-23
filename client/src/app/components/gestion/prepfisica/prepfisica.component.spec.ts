import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepfisicaComponent } from './prepfisica.component';

describe('PrepfisicaComponent', () => {
  let component: PrepfisicaComponent;
  let fixture: ComponentFixture<PrepfisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepfisicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrepfisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
