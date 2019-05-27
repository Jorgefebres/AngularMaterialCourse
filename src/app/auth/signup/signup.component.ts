import { UIService } from 'src/app/shared/iu.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate;
  isLoading = false;
  private loadingSubscription:Subscription;

  constructor(
    private _authService:AuthService,
    private _UIService:UIService
    ) { }

  ngOnInit() {
    this.loadingSubscription = this._UIService.loadingStateChanged.subscribe(isLoading=>{
      this.isLoading= isLoading;
    })
    this.maxDate = new Date();
    //seteamos la fecha maxima a hoy menos 18
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }
  onSubmit(form: NgForm){
    this._authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }
  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
