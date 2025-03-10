import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDisplayComponent } from './trip-display.component';

describe('TripDisplayComponent', () => {
  let component: TripDisplayComponent;
  let fixture: ComponentFixture<TripDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
