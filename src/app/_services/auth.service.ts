import { Global } from '../global';
import { map } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn = new BehaviorSubject<boolean>(false);
  cast = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private global : Global) {}

  //For fresh page load login check
  checkLogin(){
    if (localStorage.getItem('currentUser'))
      this.loggedIn.next(true);
  }

  //Login check
  login(username: string, password: string) {
    return this.http.put<any>(this.global.databaseURL + "/order", { username: username, password: password })
      .pipe(map(user => {
        user = "manu";
        // login successful if there's a jwt token in the response
        if (user) { //&& user.token
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.loggedIn.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }));
  }

  //Logout user
  logout() {
    // remove user from local storage to log user out
    this.loggedIn.next(false);
    localStorage.removeItem('currentUser');
  }

}