import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productModel: any = {
    price: 100.00, name: "Product Name",
    primaryImageUrl: "http://via.placeholder.com/400x400",
    bigImageUrl: "http://via.placeholder.com/1200x800",
    storeName: "Store Name ",
    category: "Category",
    stockNumber: "Stock number",
    description: "Keep your feet warm and cozy while traveling with these beautiful socks. Inspiration for this socks came from long-lived Lithuanian knitting traditions where the main value of the socks is longevity and warmness necessary to survive in long cold winters. Socks are made from 100% sheep wool yarn. The color of the socks is natural, not dyed. They are thick, warm and healthy for your feet. Please, select your size and I will make the socks for you within 1-2 week.",
    measuringUnit: "Measuring unit",
    farmStoreName: "Farm Store Name",
    location: " Place, ST",
    productPhotos: [
      { imageUrl: "http://via.placeholder.com/75x75" },
      { imageUrl: "http://via.placeholder.com/75x75" },
      { imageUrl: "http://via.placeholder.com/75x75" }
    ]
  };
  productId = null;
  qty = 1;
  qtyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private router: ActivatedRoute, private http: HttpClient, public _loaderService: LoaderService) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.productId = params['id'];

      this.getProductDetails();
    });
  }

  getProductDetails() {
    //Todo dev - API to get product details

  }

  addToCart() {
    if (this.qty > 0) {
      //Todo dev - API
    }

  }

}
