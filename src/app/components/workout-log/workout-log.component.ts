import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from './../../service/data.service';
import { Workout } from './../../models/workout.model'

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.css']
})
export class WorkoutLogComponent implements OnInit {

  displayedColumns: string[] = ['title', 'type', 'date', 'distance', 'time', 'rpe', 'feeling'];
  dataSource = new MatTableDataSource<Workout>();

  rawData: any[] = [];
  workouts: Workout[] = [];

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.service.getData().subscribe(rawData => {
      const records = rawData.split('\n');
      // remove the header row
      records.shift();

      records.forEach(record => {
        if(record) {
          console.log("record:" + record);

          let currentRecordData: any[];
          let workout: Workout = new Workout();

          currentRecordData = record.split('","');

          workout.title = currentRecordData[0].trim().substring(1);
          workout.type = currentRecordData[1].trim();
          workout.date = currentRecordData[5].trim();
          workout.distance = currentRecordData[7].trim();
          workout.time = currentRecordData[12].trim();
          workout.rpe = currentRecordData[43].trim();
          workout.feeling = currentRecordData[44].trim().slice(0, -1);

          this.rawData.push(record);
          this.workouts.push(workout);
          console.log(workout);
        }
      });

      this.dataSource.data = this.workouts;
    });
  }

}
