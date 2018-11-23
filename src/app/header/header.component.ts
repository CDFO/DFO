import { Router } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { CartService } from '../_services/cart.service';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {ProgressBarComponent} from '../_services/progressbar';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {Keepalive} from '@ng-idle/keepalive';
import {EventTargetInterruptSource, Idle} from '@ng-idle/core';


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

  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;

  constructor(
    private router : Router,
    private cart : CartService, 
    private dialog : MatDialog,
    private auth : AuthService, 

    private element: ElementRef, 
    private idle: Idle, 
    private keepalive: Keepalive, 
    private ngbModal: NgbModal
  ){ 
    this.profilePic = '../../assets/images/profile/user.png';
  }

  ngOnDestroy() {
    this.logout();
    this.resetTimeOut();
    console.log('ngOnDestroy!');
  }

  //Execution Order - 0 & 6
  reset(source) {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    console.log('Reset! - '+source);
  }

  //Execution Order - 1
  openProgressForm(count: number) {
    this.progressBarPopup = this.ngbModal.open(ProgressBarComponent, {
      backdrop: 'static',
      keyboard: false
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      if (result !== '' && 'logout' === result) {
        this.logout();
      } else if (result == 'continue'){
        this.reset(result + ' - openProgressForm');
      } 
    });
    console.log('openProgressForm!');
  }

  //Execution Order - 2
  reverseNumber(countdown: number) {
    console.log('reverseNumber!');
    return (300 - (countdown - 1));
  }

  //Execution Order - 3
  closeProgressForm() {
    this.progressBarPopup.close();
    console.log('closeProgressForm!');
  }

  //Execution Order - 4
  resetTimeOut() {
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    console.log('resetTimeOut!');
  }

  //Execution Order - 5
  logout(){
    this.resetTimeOut();
    this.auth.logout();;
    this.router.navigate(['\login']);
    console.log('logout!');
  }


  //***************************************************************** */

  ngOnInit() {
    this.auth.checkLogin();
    this.auth.cast.subscribe(login => {
      this.loggedIn = login;
      this.cart.cast.subscribe(totalItems =>  this.nCount = totalItems);
      if (!this.nCount)
        this.cart.getFromCart(0).subscribe(data => this.nCount = data.length);

      if (this.loggedIn){
        //console.log(this.loggedIn);
        // sets an idle timeout of 15 minutes.
        this.idle.setIdle(10);//900
        // sets a timeout period of 5 minutes.
        this.idle.setTimeout(300);
        // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
        this.idle.setInterrupts([
          new EventTargetInterruptSource(
            document.getElementsByTagName('body'), 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
          )
        ]);
        //console.log(document.getElementsByTagName('body'));

        this.idle.onIdleEnd.subscribe(() => {
          this.idleState = 'NO_LONGER_IDLE';
        });

        this.idle.onTimeout.subscribe(() => {
          this.idleState = 'TIMED_OUT';
          this.timedOut = true;
          this.closeProgressForm();
          this.logout();
        });

        this.idle.onIdleStart.subscribe(() => {
          this.idleState = 'IDLE_START', this.openProgressForm(1);
        });

        this.idle.onTimeoutWarning.subscribe((countdown: any) => {
          this.idleState = 'IDLE_TIME_IN_PROGRESS';
          this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
          this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
          this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
          this.progressBarPopup.componentInstance.countSeconds = countdown%60;
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);
        this.reset('Init');
      }


    });
  }
  
  signout(){
    const dlg = this.dialog.open(AlertComponent, {
      data: {title: 'Confirm Logout', msg: 'Are you sure you want to logout?', icon:'sign-out'}
    });
    dlg.afterClosed().subscribe((logout: boolean) => {
      if (logout) {
        this.auth.logout();;
        this.router.navigate(['\login']);
        //window.location.href = "\login";
      }
    });
  }

}