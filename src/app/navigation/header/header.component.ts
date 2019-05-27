import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<Boolean>;
  constructor(private _store:Store<fromRoot.State>, private _authService:AuthService) { }

  ngOnInit() {
    this.isAuth$ = this._store.select(fromRoot.getIsAuth);
  }
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }
  onLogout(){
    this._authService.logout();
  }
}
