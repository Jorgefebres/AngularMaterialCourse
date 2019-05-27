import { UIService } from './../../shared/iu.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() empezarEntrenamiento = new EventEmitter<void>()
  ejercicios:Exercise[];
  exerciseSubscription: Subscription;
  isLoading = false;
  private loadingSubscription:Subscription;
  constructor(
    private _trainingService: TrainingService,
    private db: AngularFirestore,
    private _UIService:UIService
    ) { }

  ngOnInit() {
    this.loadingSubscription =  this._UIService.loadingStateChanged.subscribe(isLoading=>{
      this.isLoading = isLoading;
    })
    this.exerciseSubscription = this._trainingService.exercisesChanged.subscribe(exercises=>
      {
        this.ejercicios = exercises;        
      });
      this.fetchExercises();    
  }
  fetchExercises(){
    this._trainingService.fetchAvailableExercises();
  }
  onStartTraining(form:NgForm){
    this._trainingService.startExercise(form.value.ejercicio);
  }
  ngOnDestroy(){
    this.exerciseSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}
