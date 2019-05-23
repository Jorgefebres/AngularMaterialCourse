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

  constructor(private db: AngularFirestore){}

  fetchAvailableExercises(){
    this.fbSubscriptions.push(this.db
    .collection('availableExercises')
    .snapshotChanges()
    .pipe
    (map(docArray=>{
      return docArray.map(doc =>{
        return{
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe((exercises: Exercise[])=>{
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
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
