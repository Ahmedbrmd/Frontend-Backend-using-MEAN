import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVEventComponent } from './update-v-event.component';

describe('UpdateVEventComponent', () => {
  let component: UpdateVEventComponent;
  let fixture: ComponentFixture<UpdateVEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateVEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
