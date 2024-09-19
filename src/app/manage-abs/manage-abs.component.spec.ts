import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAbsComponent } from './manage-abs.component';

describe('ManageAbsComponent', () => {
  let component: ManageAbsComponent;
  let fixture: ComponentFixture<ManageAbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAbsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageAbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
