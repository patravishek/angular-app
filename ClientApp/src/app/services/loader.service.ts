import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoaderService {
  
  constructor(private spinner: NgxSpinnerService) { }

  show(){
    this.spinner.show();
  }
  
  hide(){
    this.spinner.hide();
  }
}
