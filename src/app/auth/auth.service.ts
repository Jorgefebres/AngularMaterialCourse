import { TrainingService } from './../training/training.service';

import { AuthData } from './auth-data.module';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'
import * as UI from '../shared/ui.actions'
import * as Auth from '../auth/auth.actions'

@Injectable()
export class AuthService{
  constructor(
    private _router:Router,
    private _afAuth:AngularFireAuth,
    private _trainingService: TrainingService,
    private _uiService: UIService,
    private _store: Store<fromRoot.State>
    ){}

    initAuthListener(){
      this._afAuth.authState.subscribe(user=>{
        if(user){
          this._store.dispatch(new Auth.SetAuthenticated());
          this._router.navigate(['/training']);
        }else{
          this._trainingService.cancelSubscriptions();
          this._store.dispatch(new Auth.SetUnanthenticated());
          this._router.navigate(['/login']);
        }
      })
    }

    registerUser(authData: AuthData){
      this._store.dispatch(new UI.StartLoading());
      this._afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result=>{
        this._store.dispatch(new UI.StopLoading());
      })
      .catch(error=>{
        this._store.dispatch(new UI.StopLoading());
        this._uiService.showSnackbar(error.message, null, 3000);
      });
    }
    login(authData:AuthData){
      this._store.dispatch(new UI.StartLoading());
      this._afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result=>{
        this._store.dispatch(new UI.StopLoading());
      })
      .catch(error=>{
        this._store.dispatch(new UI.StopLoading());
        this._uiService.showSnackbar(error.message, null, 3000);
      });
    }
    logout(){
      this._afAuth.auth.signOut();
    }
  }
