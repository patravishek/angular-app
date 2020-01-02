import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedUnfollowingComponent } from './followed-unfollowing.component';

describe('FollowedUnfollowingComponent', () => {
  let component: FollowedUnfollowingComponent;
  let fixture: ComponentFixture<FollowedUnfollowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedUnfollowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedUnfollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
