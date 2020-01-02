import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

  states = [];
  rootImgPath: any = config.imgPath;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  classifiedList = [
    { id: "1", name: "Cattle" },
    { id: "2", name: "Goat" },
    { id: "3", name: "Sheep" },
    { id: "4", name: "Horse" },
    { id: "5", name: "Swine" },
    { id: "6", name: "Llama" },
    { id: "7", name: "Alpaca" },
    { id: "8", name: "Other" }
  ];
  auctionList = [
    // { id: 1, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" },
    // { id: 2, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" },
    // { id: 3, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" },
    // { id: 4, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" },
    // { id: 5, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" },
    // { id: 6, hours: 16, breedLiveStockName: "Group Name", startBidPrice: 24.99, bid: 20, byNowPrice: 51.99, breedName: "Cattle", country: "Icelandic", maleCount: 10, femaleCount: 10, sellerName: "Seller Name", sellerAddress: "Place, ST", herdLogo: "http://placehold.it/700x400" }
  ];

  searchText = "";


  constructor(private http: HttpClient, public _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.getStates();
    this.getAuctionList();
    this.getAnimalTypes();
  }

  getAnimalTypes() {
    this.http.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
      this.classifiedList = data;
    });
  }

  getStates() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetStates', this.httpOptions).subscribe((data: any) => {
      this.states = data;
      this._loaderService.hide();
    });
  }

  getAuctionList() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetAuctionListForSale?Searchtext=' + this.searchText + '', this.httpOptions).subscribe((data: any) => {
        this.auctionList = data;
    this._loaderService.hide();
  }, err => {
  this._loaderService.hide();
}
    );
}
}
