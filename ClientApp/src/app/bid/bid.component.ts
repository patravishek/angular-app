import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  sellerModel: any = {
    sellerName: "Vardaman Bundren", location: "Place, ST",
    sellerImageUrl: "http://via.placeholder.com/30x30", farmName: "Southern Gothic Farm", auctionGroup: "Auction Group Name", auctionDetail: "20 Icelandic Cattle (10 M, 10 F)", group: "Group auction", bid: 24.99, buy: 51.99,
    auctionInfo: "Buyer arranges transportaion"
  };
  groupBidBuyModel = {
    paymentMethod: "Paypal", cardNumber: "XX054", startPrice: 402, shipping: "Buyer arranges transportation", buyNowPrice: 560
  };
  bids:any=[
    {id:1,name:"John",bigImageUrl:"http://via.placeholder.com/1200x800",imageUrl:"http://via.placeholder.com/200x200",animalType:"Goat",breed:"Canary Island",gender:"Bred Female",dob:new Date(2017,8,14),year:1,height:"5'7\"",
    idDetailsModel:{
      idNumber:"1234",
      color:"White",
      microchipName:"Yes",
      tattoSymbol:"'Mom' in a heart",
      regCertfileName:"",
      recordBigImageUrl:"http://via.placeholder.com/1200x800",
      recordPhotos:[{imageUrl:"http://via.placeholder.com/100x100"},
      {imageUrl:"http://via.placeholder.com/100x100"}
    ]
    },
    healthIssueModel:[
      {id:1,healthDate:new Date(2017,9,1),healthDescription:"Insomnia"},
      {id:2,healthDate:new Date(2017,9,2),healthDescription:"Night Terrors"}
  
    ],
    healthRecordModel:[
      {id:1,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:2,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:3,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
    ],
    healthShowRecordModel:[
      {id:1,showRecordDate:new Date(2017,9,1),event:"Goat Screaming Championship",healthShowRecordachievement:"Loudest Scream in the Tri Counties"},
      {id:2,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
      {id:3,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
    ],
    breedRecordModel:[
      {id:1,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:2,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:3,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
    ]
  },
  {id:2,name:"Paul",bigImageUrl:"http://via.placeholder.com/1200x800",imageUrl:"http://via.placeholder.com/200x200",animalType:"Goat",breed:"Canary Island",gender:"Bred Female",dob:new Date(2017,8,14),year:1,height:"5'7\"",
    idDetailsModel:{
      idNumber:"1234",
      color:"White",
      microchipName:"Yes",
      tattoSymbol:"'Mom' in a heart",
      regCertfileName:"",
      recordBigImageUrl:"http://via.placeholder.com/1200x800",
      recordPhotos:[{imageUrl:"http://via.placeholder.com/100x100"},
      {imageUrl:"http://via.placeholder.com/100x100"}
    ]
    },
    healthIssueModel:[
      {id:1,healthDate:new Date(2017,9,1),healthDescription:"Insomnia"},
      {id:2,healthDate:new Date(2017,9,2),healthDescription:"Night Terrors"}
  
    ],
    healthRecordModel:[
      {id:1,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:2,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:3,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
    ],
    healthShowRecordModel:[
      {id:1,showRecordDate:new Date(2017,9,1),event:"Goat Screaming Championship",healthShowRecordachievement:"Loudest Scream in the Tri Counties"},
      {id:2,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
      {id:3,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
    ],
    breedRecordModel:[
      {id:1,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:2,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:3,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
    ]
  },
  {id:3,name:"George",bigImageUrl:"http://via.placeholder.com/1200x800",imageUrl:"http://via.placeholder.com/200x200",animalType:"Goat",breed:"Canary Island",gender:"Bred Female",dob:new Date(2017,8,14),year:1,height:"5'7\"",
    idDetailsModel:{
      idNumber:"1234",
      color:"White",
      microchipName:"Yes",
      tattoSymbol:"'Mom' in a heart",
      regCertfileName:"",
      recordBigImageUrl:"http://via.placeholder.com/1200x800",
      recordPhotos:[{imageUrl:"http://via.placeholder.com/100x100"},
      {imageUrl:"http://via.placeholder.com/100x100"}
    ]
    },
    healthIssueModel:[
      {id:1,healthDate:new Date(2017,9,1),healthDescription:"Insomnia"},
      {id:2,healthDate:new Date(2017,9,2),healthDescription:"Night Terrors"}
  
    ],
    healthRecordModel:[
      {id:1,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:2,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:3,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
    ],
    healthShowRecordModel:[
      {id:1,showRecordDate:new Date(2017,9,1),event:"Goat Screaming Championship",healthShowRecordachievement:"Loudest Scream in the Tri Counties"},
      {id:2,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
      {id:3,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
    ],
    breedRecordModel:[
      {id:1,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:2,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:3,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
    ]
  },
  {id:3,name:"Ringo",bigImageUrl:"http://via.placeholder.com/1200x800",imageUrl:"http://via.placeholder.com/200x200",animalType:"Goat",breed:"Canary Island",gender:"Bred Female",dob:new Date(2017,8,14),year:1,height:"5'7\"",
    idDetailsModel:{
      idNumber:"1234",
      color:"White",
      microchipName:"Yes",
      tattoSymbol:"'Mom' in a heart",
      regCertfileName:"",
      recordBigImageUrl:"http://via.placeholder.com/1200x800",
      recordPhotos:[{imageUrl:"http://via.placeholder.com/100x100"},
      {imageUrl:"http://via.placeholder.com/100x100"}
    ]
    },
    healthIssueModel:[
      {id:1,healthDate:new Date(2017,9,1),healthDescription:"Insomnia"},
      {id:2,healthDate:new Date(2017,9,2),healthDescription:"Night Terrors"}
  
    ],
    healthRecordModel:[
      {id:1,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:2,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
      {id:3,recordDate:new Date(2017,9,1),healthRecordDescription:"Description",type:"Type"},
    ],
    healthShowRecordModel:[
      {id:1,showRecordDate:new Date(2017,9,1),event:"Goat Screaming Championship",healthShowRecordachievement:"Loudest Scream in the Tri Counties"},
      {id:2,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
      {id:3,showRecordDate:new Date(2017,9,1),event:"Event Name",healthShowRecordachievement:"Achievement"},
    ],
    breedRecordModel:[
      {id:1,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:2,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
      {id:3,startDate:new Date(2017,9,1),dueDate:new Date(2018,9,1),breadDescription:"Description"},
    ]
  }
  ];

  isMessageSubmitted = false;
  file = "";


  constructor() { }

  ngOnInit() {
  }

  sendMessage(form) {
    if (form.invalid) {
      this.isMessageSubmitted = true;
      return;
    }

    //Todo dev - API
  }
  uploadFile(event: any) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.file = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    }
  }
}
