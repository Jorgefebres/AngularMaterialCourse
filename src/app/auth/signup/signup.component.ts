import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate;
  constructor(private _authService:AuthService) { }

  ngOnInit() {
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

}
