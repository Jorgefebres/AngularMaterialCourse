import { Subscription } from 'rxjs';
import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription:Subscription;

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(private _trainingService:TrainingService) { }

  ngOnInit() {
    this.exChangedSubscription = this._trainingService.finishedExercisesChanged.subscribe((exercises:Exercise[])=>{
      this.dataSource.data = exercises;
    });
    this._trainingService.fetchCompletedOrCancelledExercises();
  }
  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy(){
    this.exChangedSubscription.unsubscribe();
  }
}
