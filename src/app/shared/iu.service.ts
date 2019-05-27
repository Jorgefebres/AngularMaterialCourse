import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UIService{
  loadingStateChanged = new Subject<boolean>();
  
  constructor(private _snackbar:MatSnackBar){
    
  }
  
  showSnackbar(message, action, duration){
    this._snackbar.open(message, action, {duration: duration});
  }
}
