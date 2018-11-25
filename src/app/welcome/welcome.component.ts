import { Router } from '@angular/router';
import {Keepalive} from '@ng-idle/keepalive';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../_services/auth.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import {ProgressBarComponent} from '../_services/progressbar';
import {EventTargetInterruptSource, Idle} from '@ng-idle/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;

  onIdleEnd : Subscription;
  onTimeout : Subscription;
  onIdleStart : Subscription;
  onTimeoutWarning : Subscription;
  
  constructor(
    private router : Router,
    private auth : AuthService, 
    private element: ElementRef, 
    private idle: Idle, 
    private keepalive: Keepalive, 
    private ngbModal: NgbModal
  ) { }

  //Execution Order - 0 & 6
  reset(source) {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    //console.log('Reset! - '+source);
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
    //console.log('openProgressForm!');
  }

  //Execution Order - 2
  reverseNumber(countdown: number) {
    console.log('reverseNumber!');
    return (300 - (countdown - 1));
  }

  //Execution Order - 3
  closeProgressForm() {
    this.progressBarPopup.close();
    //console.log('closeProgressForm!');
  }

  //Execution Order - 4
  resetTimeOut() {
    this.idle.stop();
    this.onIdleStart.unsubscribe();
    this.onTimeoutWarning.unsubscribe();
    this.onIdleEnd.unsubscribe();
    //console.log('resetTimeOut!');
  }

  //Execution Order - 5
  logout(){
    //this.resetTimeOut();
    this.auth.logout();;
    this.router.navigate(['\login']);
    console.log('logout!');
  }

  //Execution Order - 6
  ngOnDestroy() {
    //this.logout();
    this.resetTimeOut();
    console.log('ngOnDestroy!');
  }

  //***************************************************************** */


  ngOnInit() {
        //console.log('Welcome Init');
        // sets an idle timeout of 15 minutes.
        this.idle.setIdle(900);//900
        // sets a timeout period of 5 minutes.
        this.idle.setTimeout(300);
        // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
        this.idle.setInterrupts([
          new EventTargetInterruptSource(
            document.getElementsByTagName('body'), 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
          )
        ]);
        //console.log('Initial Set Values + Intrupt');
            
        this.onIdleEnd = this.idle.onIdleEnd.subscribe(() => {
          this.idleState = 'NO_LONGER_IDLE';
        });
        //console.log('onIdleEnd.subscribe');

        this.onTimeout = this.idle.onTimeout.subscribe(() => {
          this.idleState = 'TIMED_OUT';
          this.timedOut = true;
          this.closeProgressForm();
          this.logout();
        });
        //console.log('property.subscribe');

        this.onIdleStart = this.idle.onIdleStart.subscribe(() => {
          this.idleState = 'IDLE_START', this.openProgressForm(1);
        });
        //console.log('onIdleStart.subscribe');

        this.onTimeoutWarning = this.idle.onTimeoutWarning.subscribe((countdown: any) => {
          this.idleState = 'IDLE_TIME_IN_PROGRESS';
          this.progressBarPopup.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
          this.progressBarPopup.componentInstance.progressCount = this.reverseNumber(countdown);
          this.progressBarPopup.componentInstance.countMinutes = (Math.floor(countdown / 60));
          this.progressBarPopup.componentInstance.countSeconds = countdown%60;
        });
        //console.log('onTimeoutWarning.subscribe');

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);
        this.reset('Init');
  }

}