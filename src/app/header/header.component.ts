import { Component, OnInit } from '@angular/core';
import { CartService } from '../_services/cart.service';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class HeaderComponent implements OnInit {

  nCount : number;
  profilePic : string;
  loggedIn : boolean;

  constructor(private cart: CartService, private dialog: MatDialog) { 
    this.profilePic = '../../assets/images/profile/user.png';
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')){
      this.loggedIn = true;
      this.cart.cast.subscribe(totalItems =>  this.nCount = totalItems);
      if (!this.nCount)
        this.cart.getFromCart(0).subscribe(data => this.nCount = data.length);
    }
  }

  logout(){
    const dlg = this.dialog.open(AlertComponent, {
      data: {title: 'Confirm Logout', msg: 'Are you sure you want to logout?', icon:'sign-out'}
    });
    dlg.afterClosed().subscribe((logout: boolean) => {
      if (logout) {
        localStorage.removeItem('currentUser');
        window.location.href = "\login";
      }
    });
  }

}
