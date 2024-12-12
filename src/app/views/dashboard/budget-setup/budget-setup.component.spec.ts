import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSetupComponent } from './budget-setup.component';

describe('BudgetSetupComponent', () => {
  let component: BudgetSetupComponent;
  let fixture: ComponentFixture<BudgetSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
