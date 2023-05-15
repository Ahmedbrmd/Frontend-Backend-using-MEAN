import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEventComponent } from './room-event.component';

describe('RoomEventComponent', () => {
  let component: RoomEventComponent;
  let fixture: ComponentFixture<RoomEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
