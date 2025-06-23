import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretecnicaComponent } from './secretecnica.component';

describe('SecretecnicaComponent', () => {
  let component: SecretecnicaComponent;
  let fixture: ComponentFixture<SecretecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretecnicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecretecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
