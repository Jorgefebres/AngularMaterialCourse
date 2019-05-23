import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  hayEjercicioActual = false;
  exerciseSubscription: Subscription;
  constructor(private _trainingService:TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this._trainingService.exerciseChanged.subscribe(
      exercise => {
        if(exercise){
          this.hayEjercicioActual= true;
        }else{
          this.hayEjercicioActual= false;
        }
      }
      );
    }

  }
