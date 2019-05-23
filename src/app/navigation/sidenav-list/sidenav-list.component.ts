import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
@Output() closeSidenav = new EventEmitter<void>();
authSubscription:Subscription;
isAuth = false;
  constructor(private _authService:AuthService) { }

  ngOnInit() {
    this._authService.authChange.subscribe(authStatus=>{
      this.isAuth = authStatus;
    });
  }
  onCloseSideNav(){
    this.closeSidenav.emit();
  }
  onLogout(){
    this._authService.logout();
    this.onCloseSideNav();
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
