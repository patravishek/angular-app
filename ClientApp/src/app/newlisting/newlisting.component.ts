import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { config } from '../../config/config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newlisting',
  templateUrl: './newlisting.component.html',
  styleUrls: ['./newlisting.component.css']
})
export class NewlistingComponent implements OnInit {
  tabType = "";
  rootImgPath: any = config.imgPath;
  isClassifiedSubmitted = false;
  isAllAuctionRecordSelected = false;
  isAllClassifiedRecordSelected = false;
  bsConfig: Partial<BsDatepickerConfig>;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  typeList = [
    // { id: 1, name: "Goat" },
    // { id: 2, name: "Horse" },
    // { id: 3, name: "Alpaca" }
  ];

  shippingList = [
    // { id: 1, type: "Free shipping" },
    // { id: 2, type: "Enter shipping cost" },
    // { id: 3, type: "Buyer provides transportation" }
  ];
  classiFiedRecordList = [
    { id: 1, name: "Free shipping" },
  ];
  recImageUrl = "http://via.placeholder.com/40x40";
  recordList = [
    // { id: 1, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 2, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 3, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 4, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
  ];

  auctionRecordList = [
    // { id: 1, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 2, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 3, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
    // { id: 4, imageUrl: "http://via.placeholder.com/40x40", breedLiveStockName: "Harvey", breedName: "Canary Island", gender: "Bred Female" },
  ];

  classifiedModel: any = { typeId: "", shipingTypeId: "", isSetIndividualPrices: "true", recordList: this.recordList };
  auctionModel: any = { typeId: "", shipingTypeId: "", isSetIndividualStartBids: "true", recordList: this.auctionRecordList };
  isAuctionSubmitted = false;
  classifiedId = 0;
  auctionId = 0;

  constructor(private http: HttpClient, public _loaderService: LoaderService,
    private activeRouter: ActivatedRoute,
    public _toastrService: ToastrService) {
    this.bsConfig = { showWeekNumbers: false };
  }

  ngOnInit() {
    this.activeRouter.params.subscribe(params => {
      this.classifiedId = params['id'];

      if (this.classifiedId > 0)
        this.getClassifiedDetails();
    });
    this.getAnimalTypes();
    this.getShippingtype();
  }


  getShippingtype() {
    this.http.get<any>(config.ServiceUrl + '/api/gateway/GetShippingtype', this.httpOptions).subscribe(data => {
      this.shippingList = data;
    });
  }

  getAnimalTypes() {
    this.http.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
      this.typeList = data;
    });
  }

  getClassifiedDetails() {
    this._loaderService.show();
    this.http.get<any>(config.ServiceUrl + '/api/gateway/GetClassfiedItemListByHerdmasterId?ClassifieditemId=' + this.classifiedId, this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      //  this.classifiedModel.recordList = data;
    });
  }

  getAuctionDetails() {
    this._loaderService.show();
    this.http.get<any>(config.ServiceUrl + '/api/gateway/GetAuctionListByAuctionID?AuctionID=' + this.auctionId, this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      //this.productDetModel = data;
    });
  }

  classifiedType(type) {
    this.tabType = type;
  }

  selectAuctionRecordUnselectAll() {
    let parentThis = this;
    this.auctionModel.recordList.forEach(function (item) {
      item.isSelected = parentThis.isAllAuctionRecordSelected;
    });
  }

  selectClassifiedRecordUnselectAll() {
    let parentThis = this;
    this.classifiedModel.recordList.forEach(function (item) {
      item.isSelected = parentThis.isAllClassifiedRecordSelected;
    });
  }


  saveClassified(form) {
    this.isClassifiedSubmitted = false;

    if (form.invalid) {
      this.isClassifiedSubmitted = true;
      return;
    }

    //Todo dev - API integration
    this._loaderService.show();
    var data = [];
    let parentThis = this;
    this.classifiedModel.recordList.forEach(function (item) {
      data.push({
        animalTypeId: parentThis.classifiedModel.typeId,
        breedLiveStockName: item.name,
        breedName: item.breedName,
        breedId: item.breedId,
        gender: item.gender,
        genderId: item.genderId,
        price: parentThis.classifiedModel.isSetIndividualPrices == 'false' ? parentThis.classifiedModel.priceForGroup : item.price,
        saleTitle: parentThis.classifiedModel.saleTitle,
        shipingTypeId: parentThis.classifiedModel.shipingTypeId,
        heardMasterId: item.heardMasterId
      })
    });

    this.http.post(config.ServiceUrl + '/api/gateway/SaveUpdateClassfiedItem', { breadClassfiedItems: data }, this.httpOptions).subscribe((data) => {
      this._toastrService.success("Classified saved successfully");
      this._loaderService.hide();
    }, err => {
      this._loaderService.hide();
    });
  }

  saveAuction(form) {
    this.isAuctionSubmitted = false;

    if (form.invalid) {
      this.isAuctionSubmitted = true;
      return;
    }

    var data = [];
    let parentThis = this;
    if (parentThis.auctionModel.startDate && parentThis.auctionModel.endDate && parentThis.auctionModel.startTime && parentThis.auctionModel.endTime) {
      if (parentThis.auctionModel.startDate.setHours(parentThis.auctionModel.startTime.split(":")[0], parentThis.auctionModel.startTime.split(":")[1]) > parentThis.auctionModel.endDate.setHours(parentThis.auctionModel.endTime.split(":")[0], parentThis.auctionModel.endTime.split(":")[1])) {
        parentThis._toastrService.error("Start datetime should not be greater than end datetime.");
        return;
      }
    }
    this._loaderService.show();

    this.auctionModel.recordList.forEach(function (item) {
      data.push({
        animalTypeId: parentThis.auctionModel.animalTypeId,
        breedLiveStockName: item.name,
        breedName: item.breed,
        breedId: item.breedId,
        gender: item.gender,
        genderId: item.genderId,
        startBidprice: parentThis.auctionModel.isSetIndividualStartBids == 'false' ? parentThis.auctionModel.bidForGrp : item.bid,
        byNowprice: parentThis.auctionModel.isSetIndividualStartBids == 'false' ? parentThis.auctionModel.buyPriceForGrp : item.buy,
        minprice: parentThis.auctionModel.isSetIndividualStartBids == 'false' ? parentThis.auctionModel.minBidForGrp : item.minBuy,
        auctionTitle: parentThis.auctionModel.auctionTitle,
        shipingTypeId: parentThis.auctionModel.shipingTypeId,
        startdate: parentThis.auctionModel.startDate,
        endDate: parentThis.auctionModel.endDate,
        Satrttime: parentThis.auctionModel.startTime,
        endtime: parentThis.auctionModel.endTime,
        heardMasterId: item.heardMasterId
      })
    });

    this.http.post(config.ServiceUrl + '/api/gateway/SaveUpdateauctionItem', { breadauctionItems: data }, this.httpOptions).subscribe((data) => {
      this._toastrService.success("Auction saved successfully");
      this._loaderService.hide();
    }, err => {
      this._loaderService.hide();
    });

  }

  getClassfiedBreadItemByUser(animaltypeid, type) {
    if (animaltypeid) {
      this._loaderService.show();
      var searchText = "";
      // animaltypeid = 0;
      this.http.get(config.ServiceUrl + '/api/gateway/GetClassfiedBreadItemByUser?Searchtext=' + searchText + '&animaltypeid=' + animaltypeid + '', this.httpOptions).subscribe((data) => {
        if (type == 'Classified')
          this.classifiedModel.recordList = data;
        else
          this.auctionModel.recordList = data;
        setTimeout(() => {
          this._loaderService.hide();
        }, 2000);
      },
        err => {
          this._loaderService.hide();
        }
      );
    }
  }
}

