import { UIService } from 'src/app/shared/iu.service';
import { Subscription } from 'rxjs/Subscription';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class TrainingService{

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  fbSubscriptions:Subscription[]=[];

  private runningExecise:Exercise;
  private availableExercises:Exercise[]=[];

  constructor(
    private db: AngularFirestore,
    private _UIService:UIService
    ){}

  fetchAvailableExercises(){
    this._UIService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe
    (map(docArray=>{
      // throw(new Error);
      return docArray.map(doc =>{
        return{
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe((exercises: Exercise[])=>{      
      this._UIService.loadingStateChanged.next(false);
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }, error =>{
      this._UIService.loadingStateChanged.next(false);
      this._UIService.showSnackbar('Ocurrió un error al cargar los ejercicios, por favor intente nuevamente despues', null, 3000);
      this.exercisesChanged.next(null);
    }));
  }

  startExercise(selectedId: string){
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()})
    this.runningExecise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExecise});
  }

  completedExercise(){
    this.addDataToDatabase({
      ...this.runningExecise,
      date: new Date(),
      state : 'completed'
    });
    this.runningExecise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:number){
    this.addDataToDatabase({
      ...this.runningExecise,
      duration: this.runningExecise.duration * (progress / 100),
      calories: this.runningExecise.calories * (progress / 100),
      date: new Date(),
      state : 'cancelled'
    });
    this.runningExecise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(){
    return {...this.runningExecise};
  }

  fetchCompletedOrCancelledExercises(){
    this.fbSubscriptions.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises:Exercise[])=>{
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscriptions(){
    this.fbSubscriptions.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
