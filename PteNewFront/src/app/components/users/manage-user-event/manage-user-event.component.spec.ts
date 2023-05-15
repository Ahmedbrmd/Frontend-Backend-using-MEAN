import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserEventComponent } from './manage-user-event.component';

describe('ManageUserEventComponent', () => {
  let component: ManageUserEventComponent;
  let fixture: ComponentFixture<ManageUserEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
