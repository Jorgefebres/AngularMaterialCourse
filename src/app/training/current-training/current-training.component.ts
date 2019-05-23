import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() finalizarEntrenamiento = new EventEmitter<void>();
  progreso = 0;
  timer:number;
  constructor(
    private _dialog: MatDialog
    ) { }
    
    ngOnInit() {
      this.startOrResumeTimer();
    }
    startOrResumeTimer(){
      this.timer = setInterval(()=>{      
        this.progreso =  this.progreso + 5;
        if(this.progreso>=100){
          clearInterval(this.timer);
        }
      }, 1000);
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
          this.finalizarEntrenamiento.emit();
        }else{
          this.startOrResumeTimer();
        }
      }
      );
    }
  }
  