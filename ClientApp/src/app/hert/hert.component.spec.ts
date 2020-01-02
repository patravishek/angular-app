import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HertComponent } from './hert.component';

describe('HertComponent', () => {
  let component: HertComponent;
  let fixture: ComponentFixture<HertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
