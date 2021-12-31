import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import { DataService } from './../../service/data.service';
import { Workout } from './../../models/workout.model'

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.css']
})
export class WorkoutLogComponent implements OnInit {

  displayedColumns: string[] = ['icon', 'title', 'type', 'date', 'distance', 'time', 'rpe', 'feeling'];
  dataSource = new MatTableDataSource<Workout>();

  rawData: any[] = [];
  workouts: Workout[] = [];

  constructor(private service: DataService,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry
      .addSvgIcon('bike', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bike.svg'))
      .addSvgIcon('strength', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/strength.svg'))
      .addSvgIcon('run', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/run.svg'))
      .addSvgIcon('climbing', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/climbing.svg'));
  }

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

          if(workout.type === 'X-Train') {
            if(workout.title.toLowerCase().includes('rock climbing'))
              workout.icon = 'climbing';
          }
          else
            workout.icon = workout.type.toLowerCase();

          this.rawData.push(record);
          this.workouts.push(workout);
          console.log(workout);
        }
      });

      this.dataSource.data = this.workouts;
    });
  }

}
