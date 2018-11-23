import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'progressbar-comp',
  template: `
    <div class="modal-header">
      <div class="modal-title">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        Session Timeout Warning
      </div>
    </div>
    <div class="modal-body">
      Your session will timeout in {{(countMinutes !== 0 ? + countMinutes+' Minute'+(countMinutes > 1 ? 's ' : ' ') : '') + countSeconds+' Seconds...'}}
      <ngb-progressbar type="danger" [value]="progressCount" [max]="300" animate="false" class="progress-striped active">
      </ngb-progressbar>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn dfo-primary" (click)="continue()">
        <i class="fa fa-sign-in dialogIcon" aria-hidden="true"></i>
        Continue
      </button>
      <button type="button" class="btn dfo-primary" (click)="logout()">
        <i class="fa fa-sign-out dialogIcon" aria-hidden="true"></i>
        Logout
      </button>
    </div>
  `
})
export class ProgressBarComponent {

  @Input() countMinutes: number;
  @Input() countSeconds: number;
  @Input() progressCount: number;

  constructor(public activeModal: NgbActiveModal) {}

  continue() {
    this.activeModal.close('continue');
  }
  logout() {
    this.activeModal.close('logout');
  }
}