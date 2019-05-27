import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs/Subscription';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { map, take } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import * as UI from '../shared/ui.actions'
import * as fromTraining from '../training/training.reducer'
import { Store } from '@ngrx/store';
import * as Training from '../training/training.actions'


@Injectable()
export class TrainingService{
  fbSubscriptions:Subscription[]=[];

  constructor(
    private db: AngularFirestore,
    private _UIService:UIService,
    private _store: Store<fromTraining.State>
    ){}

    fetchAvailableExercises(){
      this._store.dispatch(new UI.StartLoading());
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
          this._store.dispatch(new UI.StopLoading());
          this._store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error =>{
          // this._UIService.loadingStateChanged.next(false);
          this._store.dispatch(new UI.StopLoading());
          this._UIService.showSnackbar('Ocurrió un error al cargar los ejercicios, por favor intente nuevamente despues', null, 3000);
        }));
      }

      startExercise(selectedId: string){
       this._store.dispatch(new Training.StartTraining(selectedId))
      }

      completedExercise(){
        this._store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex =>{
          this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state : 'completed'
          });
          this._store.dispatch(new Training.StopTraining());
        });
      }

      cancelExercise(progress:number){
        this._store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex =>{
          this.addDataToDatabase({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state : 'cancelled'
          });
          this._store.dispatch(new Training.StopTraining());
        });
      }

      fetchCompletedOrCancelledExercises(){
        this.fbSubscriptions.push(this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises:Exercise[])=>{
          this._store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
      }

      cancelSubscriptions(){
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
      }

      private addDataToDatabase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise);
      }
    }
