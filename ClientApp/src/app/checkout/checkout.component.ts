import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  sellerModel: any = {};
  isMessageSubmitted = false;
  file = "";
  checkOutModel:any= {sellerName:"Vardaman Bundren",sellerFarm:"Southern Gothic Farm",sellerLocation:"Place, ST",paymentType:"Paypal",cardNumber:"XX054",totalPrice:402,shippingType:"Buyer arranges transportation",total:402,
  bigImageUrl:"http://via.placeholder.com/1200x800",imageUrl:"http://via.placeholder.com/200x200",type:"Goat",
  breed:"Canary Island",gender:"Bred Female",dob:new Date(2017,7,9),age:1,height:"5'7\"",
  idDetailsModel:{
    idNumber:"1234",
    color:"White",
    microchipName:"Yes",
    tattoSymbol:" 'Mom' in a heart",
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
};


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
