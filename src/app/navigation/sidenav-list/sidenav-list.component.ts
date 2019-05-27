import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
@Output() closeSidenav = new EventEmitter<void>();
isAuth$:Observable<Boolean>;
  constructor(private _authService:AuthService,
    private _store:Store<fromRoot.State>
    ) { }

  ngOnInit() {
    this.isAuth$ = this._store.select(fromRoot.getIsAuth);
  }
  onCloseSideNav(){
    this.closeSidenav.emit();
  }
  onLogout(){
    this._authService.logout();
    this.onCloseSideNav();
  }
}
