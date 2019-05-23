import { TrainingService } from './../training.service';
import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progreso = 0;
  timer:number;
  constructor(
    private _dialog: MatDialog,
    private _trainingService: TrainingService
    ) { }

    ngOnInit() {
      this.startOrResumeTimer();
    }
    startOrResumeTimer(){
      const step = this._trainingService.getRunningExercise().duration / 100 * 1000;
      this.timer = setInterval(()=>{
        this.progreso =  this.progreso + 1;
        if(this.progreso>=100){
          this._trainingService.completedExercise();
          clearInterval(this.timer);
        }
      }, step);
    }
    onStop(){
      clearInterval(this.timer);
      const dialogRef = this._dialog.open(StopTrainingComponent, {
        data: {
          progreso: this.progreso
        }
      });
      dialogRef.afterClosed().subscribe(result=>{
        console.log(result);
        if(result){
          this._trainingService.cancelExercise(this.progreso)
        }else{
          this.startOrResumeTimer();
        }
      }
      );
    }
  }
