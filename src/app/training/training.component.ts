import { Component, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training/training.reducer'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  hayEjercicioActual$:Observable<Boolean>
  constructor(
    private _store:Store<fromTraining.State>
    ) { }

  ngOnInit() {
    this.hayEjercicioActual$ = this._store.select(fromTraining.getIsTraining);
    }
  }
