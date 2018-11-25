import { Observable } from 'rxjs';
import { Global } from '../global';
import { Http, Response} from '@angular/http';
//import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from '../_services/cart.service';
import { AlertComponent } from '../alert/alert.component';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { CatalogueService } from '../_services/catalog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class CatalogComponent implements OnInit {

  objectProps;
  dataObject;
  dataObject2 : object;
  catID : number;
  form : FormGroup;
  categoryName : string;
  selectedIcon : string;
  formDivHeight : number;
  catalogueName : string;
  buttonClicked :string;
  successMessage : string;
  errorMessage : string;
  catalogueDescription : string;
  shuttleRoute : object;
  shuttleArea : object;
  catalogues: object;

  //Regx Patterns for Validations
  emailPattern : string = this.global.emailPattern; 
  phonePattern : string = this.global.phonePattern;

  constructor(
    private http : Http, 
    private global : Global,
    private dialog : MatDialog,
    private cart : CartService,
    private route : ActivatedRoute, 
    private spinner: Ng4LoadingSpinnerService,
    private catalogueService : CatalogueService){
      if (window.screen.width > 450)
        this.formDivHeight = window.innerHeight-50;      
    }

  //Initialize
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if(params['category'] != undefined){
        this.spinner.show();
        this.categoryName = params['category'];
        this.catalogueDescription = null;
        this.catalogueService.getCataloguesForCategory(this.categoryName).subscribe(data => {
          this.catalogues = data;
          this.spinner.hide();
          //console.log(this.catalogues);
        })
      }
    });
  }

  //Method to Confirm Form reset
  resetForm(name: string){
    const dlg = this.dialog.open(AlertComponent, {
      data: {title: 'Confirm Reset', msg: 'Are you sure you want to reset '+ name +' form?', icon:'eraser'}
    });
    dlg.afterClosed().subscribe((reset: boolean) => {
      if (reset) {
        this.form.reset();
      }
    });
  }

  //Method to Convert JSON Form data to actual Form Elements
  getCatalogueForm(id: number, name: string, description: string, fields: object, icon: string){
    this.catID = id;
    this.successMessage = null;
    this.catalogueName = name;
    this.catalogueDescription = description;
    this.selectedIcon = icon;
    this.dataObject = fields;
    //console.log(fields);
    this.objectProps = Object.keys(this.dataObject).map(prop => {
      return Object.assign({}, { key: prop }, this.dataObject[prop]);
    });

    const formGroup = {};
    var tmpAssign : object;
    for (let prop of Object.keys(this.dataObject)) {
      formGroup[prop] = new FormControl(this.dataObject[prop].value || '', this.mapValidators(this.dataObject[prop].validation));
    }
    this.form = new FormGroup(formGroup);
  }

  //Method for setting Validation for Form Fields
  private mapValidators(validators) {
    const formValidators = [];
    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }

    return formValidators;
  }

  //Method to submit the form and Add to Cart
  onSubmit(form) {
    //this.spinner.show();
    let tempObj = {
      "id" : this.catID,
      "catalogueName" : this.catalogueName,
      "catalogueDescription": this.catalogueDescription,
      "icon" : this.selectedIcon
    };
    Object.assign(form, tempObj);
    let tempObj2 = {
      "userid" : 0,
      "catalogueId" : this.catID,
      "systemid" : 0,
      "active" : true,
      "fields" : JSON.stringify(form)
    };
    //this.cart.addToCart(form);
    //console.log(tempObj2);
    this.postData(tempObj2);
    //this.successMessage = name + ': Added to cart successfully.';
  }

  //Method to fetch Child Options on Parent Dropdown change
  onParentSelect(childId,childOptions,childField,resetFields) {

    //Reset all child fields on selection
    resetFields.split(/\s*,\s*/).forEach(function(field) {
      for (let i = 0; i < childOptions.length; i++) {
        (document.getElementById(field) as HTMLSelectElement).options.remove(i);
      }
      let tmpOption = new Option('(choose one)','');
      (document.getElementById(field) as HTMLSelectElement).options.add(tmpOption);
    });

    for(let option in childOptions){
      if (childOptions[option].parentid == childId){
        //this.childOptions1.push(childOptions[option]);  
        let tmpOption = new Option(childOptions[option].label,childOptions[option].value);
        (document.getElementById(childField) as HTMLSelectElement).options.add(tmpOption);
      }
    } 
  }

  //Method to fetch Child Options on Parent Dropdown change
  onChildSelect(childId,childOptions,childField,resetFields) {
    //Reset all child fields on selection
    resetFields.split(/\s*,\s*/).forEach(function(field) {
      for (let i = 0; i < childOptions.length; i++) {
        (document.getElementById(field) as HTMLSelectElement).options.remove(i);
      }
      let tmpOption = new Option('(choose one)','');
      (document.getElementById(field) as HTMLSelectElement).options.add(tmpOption);
    });

    //Loop thorugh options from database/method 
    for(let option in childOptions){
      if (childOptions[option].parentid == childId){
        //this.childOptions2.push(childOptions[option]);  
        let tmpOption = new Option(childOptions[option].label,childOptions[option].value);
        (document.getElementById(childField) as HTMLSelectElement).options.add(tmpOption);
      }
    }
    //console.log('childField: '+childField);
  }

  /* ************* TO BE USED *************** */
  public postData(data: object) {
    let postUrl = this.global.databaseURL + "/cart";

    this.http.put(postUrl, data, this.global.putOptions)
    .subscribe(
      response => {
        this.cart.Count.next(this.cart.cartLength+1);
        this.successMessage = 'Added to cart successfully.'
        //this.spinner.hide();
      },
      error => {
        this.errorMessage = error._body.message;
        //this.spinner.hide();
        console.log(error);
      }
    );  

  }

  private handleData(res: Response){
    console.log(res);
    let body = res.json();
    return body;
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  

}
