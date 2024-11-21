import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoReunionComponent } from './tipo-reunion.component';

describe('TipoReunionComponent', () => {
  let component: TipoReunionComponent;
  let fixture: ComponentFixture<TipoReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoReunionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
