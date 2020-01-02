import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHerdComponent } from './add-edit-herd.component';

describe('AddEditHerdComponent', () => {
  let component: AddEditHerdComponent;
  let fixture: ComponentFixture<AddEditHerdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditHerdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditHerdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
