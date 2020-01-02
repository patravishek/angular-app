import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidOfferComponent } from './bid-offer.component';

describe('BidOfferComponent', () => {
  let component: BidOfferComponent;
  let fixture: ComponentFixture<BidOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
