import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthIssueComponent } from './health-issue.component';

describe('HealthIssueComponent', () => {
  let component: HealthIssueComponent;
  let fixture: ComponentFixture<HealthIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
