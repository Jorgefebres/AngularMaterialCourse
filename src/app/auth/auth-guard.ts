import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private _authService:AuthService,
        private _router:Router
        ){}
    canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this._authService.isAuth()){
            return true;
        }else{
            this._router.navigate(['/login']);
        }
    }
}
