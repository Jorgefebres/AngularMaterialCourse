import { TrainingService } from './../training/training.service';

import { AuthData } from './auth-data.module';
import { User } from './user.module';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/iu.service';

@Injectable()
export class AuthService{
  authChange = new Subject<boolean>();
  private isAuthenticated=false;
  constructor(
    private _router:Router,
    private _afAuth:AngularFireAuth,
    private _trainingService: TrainingService,
    private _snackBar: MatSnackBar,
    private _uiService: UIService
    ){}

    initAuthListener(){
      this._afAuth.authState.subscribe(user=>{
        if(user){
          this.isAuthenticated = true;
          this.authChange.next(true);
          this._router.navigate(['/training']);
        }else{
          this._trainingService.cancelSubscriptions();

          this.authChange.next(false);
          this._router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      })
    }

    registerUser(authData: AuthData){
      this._afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result=>{
      })
      .catch(error=>{
        this._snackBar.open(error.message, null, {
          duration: 3000
        })
      });
    }
    login(authData:AuthData){
      this._uiService

      this._afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password).then(result=>{
      })
      .catch(error=>{
        this._snackBar.open(error.message, null, {
          duration: 3000
        })
      });
    }
    logout(){
      this._afAuth.auth.signOut();
    }
    isAuth(){
      return this.isAuthenticated;
    }
  }
