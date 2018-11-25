import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AuthService} from '../_services/auth.service';
import { CatalogueService } from '../_services/catalog.service';
import { Subject } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {

  categories: object;
  loggedIn : boolean;
  divId : string;
  tmp : any;

  constructor(
    private router: Router, 
    private auth : AuthService, 
    private spinner: Ng4LoadingSpinnerService,
    private catalogueService: CatalogueService
  ) { }
 
  //Check user status on load
  ngOnInit() {
    this.auth.cast.subscribe(login => {
      this.loggedIn = login;
      this.divId = "main";
    });
  }

  //Minimize all menu items
  minimizeAll(){
    this.categories = null;
  }

  //Highlight menu items on selection/click
  isActive(viewLocation){
    let url = this.router.url;
    if (url.indexOf(viewLocation) == 0){
      if (viewLocation == '/catalogue' && !this.categories){
        this.getCategory();
      }
      return true;
    }
    else{
      return false;
    }
  }

  //Method to get categories to derive sub menu
  getCategory(){
    this.spinner.show();
    this.catalogueService.getCategories().subscribe(data => {
      this.categories = data;
      this.spinner.hide();
    });
  }

}