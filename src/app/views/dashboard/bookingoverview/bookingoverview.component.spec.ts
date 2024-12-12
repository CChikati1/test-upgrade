import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingoverviewComponent } from './bookingoverview.component';

describe('BookingoverviewComponent', () => {
  let component: BookingoverviewComponent;
  let fixture: ComponentFixture<BookingoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingoverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
