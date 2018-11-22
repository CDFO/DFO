import { first } from 'rxjs/operators';
import { AuthService} from '../_services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  submitted = false;
  loading = false;
  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    private router : Router,
    private auth : AuthService, 
    private alert : AlertService,
    private route : ActivatedRoute, 
    private formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // reset login status
    this.auth.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';    
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.auth.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alert.error(error);
          this.loading = false;
        }
    );  
  }

}