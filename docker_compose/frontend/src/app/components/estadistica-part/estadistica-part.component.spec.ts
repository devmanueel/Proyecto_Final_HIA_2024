import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaPartComponent } from './estadistica-part.component';

describe('EstadisticaPartComponent', () => {
  let component: EstadisticaPartComponent;
  let fixture: ComponentFixture<EstadisticaPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticaPartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticaPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
