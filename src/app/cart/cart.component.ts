import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../_services/cart.service';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class CartComponent implements OnInit {

  myCart : Array<Object> = [];
  cartObject : object;
  cartKeys :  object;
  successMessage : string;
  catalogueDescription : string;
  formDivHeight : number;
  errorMessage : string;
  userId : number = 0;

  constructor(
    private dialog: MatDialog,
    private cart: CartService,
    private spinner: NgxSpinnerService,
    ) {
      if (window.screen.width > 450)
        this.formDivHeight = window.innerHeight-50;
  }

  //Display cart for user
  ngOnInit() {
    this.spinner.show();
    this.cart.getFromCart(this.userId).subscribe(data => {
      this.myCart = data;
      this.spinner.hide();
    });
  }

  //Show details for selected cart item
  showCartDetails(item: JSON, catalogueDescription){
    this.cartKeys = Object.keys(item);
    this.cartObject = item;
    this.catalogueDescription = catalogueDescription;
  }

  //Delete from Cart
  removeFromMyCart(id: number, name: string){
    const dlg = this.dialog.open(AlertComponent, {
      data: {title: 'Confirm Delete', msg: 'Are you sure you want to remove '+ name +' from cart?', icon:'trash'}
    });
    dlg.afterClosed().subscribe((remove: boolean) => {
      if (remove) {
        this.spinner.show();
        this.cart.removeFromCart(id).subscribe(
          response => {
            this.cartObject = null;
            this.successMessage = 'Item '+ name +' has been removed sucessfully.';
            this.cart.getFromCart(this.userId).subscribe(data => {
              this.myCart = data;
              this.spinner.hide();
            })
          },
          error => {
            this.errorMessage = error._body.message;
            this.spinner.hide();
            console.log(error);    
          }
        );
      }
    });
  }

  //Move from cart to request - Checkout
  checkout(){
    const dlg = this.dialog.open(AlertComponent, {
      data: {title: 'Confirm Checkout', msg: (this.myCart.length > 1) ? 'Are you sure you want to checkout ' + this.myCart.length + ' items from your cart?' : 'Are you sure you want to checkout 1 item from your cart?', icon:'check-circle'}
    });
    dlg.afterClosed().subscribe((checkout: boolean) => {
      if (checkout) {
        this.spinner.show();
        this.cart.addToMyRequests(this.userId).subscribe(
          response => {
            this.cartObject = null;
            this.successMessage = (this.myCart.length > 1) ? this.myCart.length + ' items have been submitted sucessfully' : 'Item has been submitted sucessfully';
            this.cart.getFromCart(this.userId).subscribe(data => {
              this.myCart = data;
              this.spinner.hide();
            })
          },
          error => {
            this.errorMessage = error;//._body.message
            this.spinner.hide();
            console.log(error);    
          }
        );
      }
    });
  }
}