import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad{
  constructor(
    private _store:Store<fromRoot.State>,
    ){}
    canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot){
      return this._store.select(fromRoot.getIsAuth);
    }
    canLoad(route:Route){
      return this._store.select(fromRoot.getIsAuth).pipe(take(1));
    }
  }
