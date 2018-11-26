import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutologoutComponent } from './autologout.component';

describe('AutologoutComponent', () => {
  let component: AutologoutComponent;
  let fixture: ComponentFixture<AutologoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutologoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutologoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
