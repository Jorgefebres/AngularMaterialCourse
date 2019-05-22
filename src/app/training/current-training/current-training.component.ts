import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progreso = 0;
  timer:number;
  constructor() { }

  ngOnInit() {
    this.timer = setInterval(()=>{
      this.progreso =  this.progreso + 10;
      if(this.progreso>=100){
        clearInterval(this.timer);
      }
    }, 1000);
  }
  onStop(){
    clearInterval(this.timer);
  }
}
