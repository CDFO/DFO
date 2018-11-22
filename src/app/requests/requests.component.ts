import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../_services/cart.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  myRequests : Array<Object> = [];
  cartKeys : object;
  cartObject : object;
  catalogueDescription : string;
  catID : number;
  formDivHeight : number;
  Math : Math;
  userId : number = 0;

  constructor(
    private elRef: ElementRef, 
    private cart: CartService, 
    private cookie : CookieService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2){    
      if (window.screen.width > 450)
        this.formDivHeight = window.innerHeight-50;
    }

  //Display requests made 
  ngOnInit() {
    this.spinner.show();
    this.cart.getMyRequests(this.userId).subscribe(data => {
      this.myRequests = data;
      this.spinner.hide();
    });
  }

  //Display request details on selection
  showReqDetails(item: JSON, id, catalogueDescription){
    this.cartKeys = Object.keys(item);
    this.cartObject = item;
    this.catID = id;
    this.catalogueDescription = catalogueDescription;
  }

}