import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddepComponent } from './adddep.component';

describe('AdddepComponent', () => {
  let component: AdddepComponent;
  let fixture: ComponentFixture<AdddepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
