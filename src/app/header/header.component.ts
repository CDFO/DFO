import { Component, OnInit } from '@angular/core';
import { CartService } from '../_services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  nCount : number;
  profilePic : string;
  loggedIn : boolean;

  constructor(private cart: CartService) { 
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

}
