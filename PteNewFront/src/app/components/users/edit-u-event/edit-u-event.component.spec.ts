import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUEventComponent } from './edit-u-event.component';

describe('EditUEventComponent', () => {
  let component: EditUEventComponent;
  let fixture: ComponentFixture<EditUEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
