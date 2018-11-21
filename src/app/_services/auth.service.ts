import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Global } from '../global';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private global : Global) {}

  login(username: string, password: string) {
    return this.http.put<any>(this.global.databaseURL + "/order", { username: username, password: password })
      .pipe(map(user => {
        user = "manu";
        // login successful if there's a jwt token in the response
        if (user) { //&& user.token
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}