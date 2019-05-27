import { NgForm } from '@angular/forms';
import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromTraining from '../training.reducer'
import * as fromRoot from '../../app.reducer'

import { Store } from '@ngrx/store';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  @Output() empezarEntrenamiento = new EventEmitter<void>()
  exercises$:Observable<Exercise[]>;
  isLoading$:Observable<Boolean>;
  constructor(
    private _trainingService: TrainingService,
    private _store:Store<fromTraining.State>
    ) { }

    ngOnInit() {
      this.isLoading$ = this._store.select(fromRoot.getIsLoading);
      this.exercises$ = this._store.select(fromTraining.getAvailableExercises)
      this.fetchExercises();
      }
      fetchExercises(){
        this._trainingService.fetchAvailableExercises();
      }
      onStartTraining(form:NgForm){
        this._trainingService.startExercise(form.value.ejercicio);
      }
    }
