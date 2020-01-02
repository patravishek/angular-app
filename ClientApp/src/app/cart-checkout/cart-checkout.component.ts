import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css']
})
export class CartCheckoutComponent implements OnInit {

  sellerModel: any = {};
  isMessageSubmitted = false;
  file = "";
  cartCheckoutModel = {
    shippingDetails: {
      firstName: "Firstname",
      lastname: "Lastname",
      address: "805 W Manchester Blvd.",
      state: "Inglewood",
      country: "CA",
      zipCode: "90301"
    },
    paymentDetails: {
      paymentMethod: "Paypal",
      cardNumber: "XX054"
    },
    checkoutDetails: {
      subTotal: 600.00,
      shippingCost: 30.00,
      total: 630.00
    },
  }

  sellerInfoModel = [
    {
      id: 1, sellerName: "Vardaman Bundren", sellerImageUrl: "http://via.placeholder.com/30x30", storeName: "Southern Gothic Store", location: "Place, ST",
      productInfoModel: [
        { id: 1, productName: "First Product Title", shipping: "Buyer provides transportation", price: 100, category: "CATEGORY", qty: 1, productImageUrl: "http://via.placeholder.com/150x150", bigImageUrl: "http://via.placeholder.com/1200x800" }
      ]
    },
    {
      id: 2, sellerName: "Frank Sinatra", sellerImageUrl: "http://via.placeholder.com/30x30", storeName: "Nothing But the Best", location: "Place, ST",
      productInfoModel: [
        { id: 2, productName: "Second Product Title", shipping: "$15 shipping", price: 200, category: "CATEGORY", qty: 1, productImageUrl: "http://via.placeholder.com/150x150", bigImageUrl: "http://via.placeholder.com/1200x800" },
        { id: 3, productName: "Third Product Title", shipping: "$15 shipping", price: 300, category: "CATEGORY", qty: 1, productImageUrl: "http://via.placeholder.com/150x150", bigImageUrl: "http://via.placeholder.com/1200x800" }
      ]
    }
  ];
  qtyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  bankAccounts = [
    { id: 1, paymentMethod: "Paypal", cardNumber: "XX054", account: "Bank account" },
    { id: 2, paymentMethod: "Paypal", cardNumber: "XX088", account: "Bank account" }
  ];
  shippingAddresses = [
    { id: 1, firstname: "Firstname", lastname: "Lastname", address: "3455 Overland Ave", city: "Los Angeles", country: "CA", zip: "90034" },
    { id: 1, firstname: "Firstname", lastname: "Lastname", address: "805 W Manchester Blvd.", city: "Inglewood", country: "CA", zip: "90301" }
  ]

  shippingAddressModel: any = {};
  isShippingAddressSubmitted = false;


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
  pay(item) {

  }
  payDifferent() {

  }
  save(form) {
    this.isShippingAddressSubmitted = false;

    if (form.invalid) {
      this.isShippingAddressSubmitted = true;
      return;
    }
  }
  useAddress(item) {

  }
}
