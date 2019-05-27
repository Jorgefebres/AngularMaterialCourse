import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/iu.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private loadingSubscrition: Subscription;
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private _authService: AuthService,
    private _UIService:UIService
    ) {}

  ngOnInit() {
    this.loadingSubscrition = this._UIService.loadingStateChanged.subscribe(isLoading =>{
      this.isLoading = isLoading
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this._authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
  ngOnDestroy() {
    this.loadingSubscrition.unsubscribe();
  }
}

