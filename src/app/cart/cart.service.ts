import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Http, Response, Headers, RequestOptions, ResponseContentType, RequestMethod  } from '@angular/http';
import { map,tap } from 'rxjs/operators';

@Injectable()
export class CartService{

  jsonObj : Object;
  cookieCart : string;
  cookieReq : string;
  public counter : number = 1;
  myCart : Array<Object> = [];
  myRequests : Array<Object> = [];
  cartLength : number;
  public Count = new BehaviorSubject<number>(0);
  cast = this.Count.asObservable();

  public options = new RequestOptions({
    headers: new Headers({'Content-Type':'application/json'}),
    method: RequestMethod.Put,
    responseType: ResponseContentType.Json,
    withCredentials: false
  });

  constructor(private cookie : CookieService, private http: HttpClient){}

  removeFromCart(cartId: number): Observable<string>{
    /*
    this.myCart.splice(this.myCart.indexOf(val),1);
    //this.cookie.delete('myCart');
    this.cookie.set('myCart',JSON.stringify(this.myCart),5);
    this.Count.next(this.myCart.length);
    */
   this.Count.next(this.cartLength-1);
   return this.http.delete<string>("http://localhost:8084/cart/{cartId}?cartId="+cartId);
  }

  getFromCart(userId: number): Observable<Array<Object>>{
    /*
    if (this.cookie.check('myCart') && this.myCart.length == 0){
      this.myCart = [];
      this.jsonObj = JSON.parse(this.cookie.get('myCart'));
      //console.log('Get: '+ this.cookie.get('myCart'));
      for(var obj in this.jsonObj){
        this.myCart.push(this.jsonObj[obj]);
        //console.log(this.jsonObj[obj]);
      }
    }
    return this.myCart;
    */
    return this.http.get<Array<Object>>("http://localhost:8084/cart/{userId}?userId="+userId).pipe(tap(data => { 
      var array = this.generateArray(data); 
      for (let key1 in array) {
        array[key1].fields = this.JSONFormating(array[key1].fields);
      }
      this.cartLength = array.length;
      this.Count.next(array.length);
      return array;
    }));
  }

  addToMyRequests(userId: number): Observable<string>{
    this.Count.next(this.myCart.length);
    return this.http.get<string>("http://localhost:8084/cart/checkOut/{userid}?userid="+userId);
    /*
    this.cookieCart = this.cookie.get('myCart');
    this.cookieReq = this.cookie.get('myRequests');
    this.myRequests = [];
    if (this.cookie.check('myRequests'))
    {
      //Loop through Request Cookie 
      var jsonObj1 = JSON.parse(this.cookieReq);
      for(var obj in jsonObj1){
        this.myRequests.push(jsonObj1[obj]);
      }
      //Loop through Cart Cookie 
      var jsonObj2 = JSON.parse(this.cookieCart);
      for(var obj in jsonObj2){
        let tempObj = {
          "submittedDate" : new Date()
         };
        Object.assign(jsonObj2[obj], tempObj);
        this.myRequests.push(jsonObj2[obj]);
      }
    }
    else{
      var jsonObj = JSON.parse(this.cookieCart);
      for(var obj in jsonObj){
        let tempObj = {
          "submittedDate" : new Date()
         };
        Object.assign(jsonObj[obj], tempObj);
        this.myRequests.push(jsonObj[obj]);
      }
    }
    //this.cookie.delete('myRequests');
    this.cookie.set('myRequests',JSON.stringify(this.myRequests),365);
    this.cookie.delete('myCart');
    this.myCart = [];
    this.Count.next(this.myCart.length);
    */

  }

  getMyRequests(){
    if (this.cookie.check('myRequests') && this.myRequests.length == 0){
      var jsonObj = JSON.parse(this.cookie.get('myRequests'));
      //console.log('My Reqs : '+ this.cookie.get('myRequests'));
      for(var obj in jsonObj){
        this.myRequests.push(jsonObj[obj]);
      }
    }
    return this.myRequests;
  }

  //Method for converting JSON format from Java interface to Angular accepted form 
  JSONFormating(data): JSON{
    return JSON.parse(JSON.stringify(data).replace(/\\r\\n/g, "").replace(/\\"/g, '"').replace(/\\t/g,"").replace(/\s\s+/g, " ").replace(/"{/g,"{").replace(/}"/g,"}"));
  }

  //Method to convert object to array
  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
  }

}