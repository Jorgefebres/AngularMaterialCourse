import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
@Output() sidenavToggle = new EventEmitter<void>();
isAuth = false;
authSubscription:Subscription;
  constructor(private _authService:AuthService) { }

  ngOnInit() {
    this._authService.authChange.subscribe(authStatus=>{
      this.isAuth = authStatus;
    });
  }
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }
  onLogout(){
    this._authService.logout();
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
