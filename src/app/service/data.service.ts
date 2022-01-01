import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Workout } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataFile: string = '/assets/workouts.csv';

  constructor(private http: HttpClient) { }

  getRawData(): Observable<String> {
    return this.http.get(this.dataFile, { responseType: 'text' });
  }

  getFormattedData(): Observable<Workout[]> {
    return this.http.get(this.dataFile, { responseType: 'text' })
      .pipe(
        map((rawData: String) => {
          let workouts: Workout[] = [];
          const records = rawData.split('\n');
          records.shift(); // remove the header row

          records.forEach(record => {
            if (record) workouts.push(this.parseRecordToWorkout(record));
          });

          return workouts;
        })
      );
  }

  parseRecordToWorkout(record: String): Workout {
    console.log("record:" + record);

    let currentRecordData: any[];
    let workout: Workout = new Workout();

    currentRecordData = record.split('","');

    workout.title = currentRecordData[0].trim().substring(1); // remove leading " char
    workout.type = currentRecordData[1].trim();
    workout.date = currentRecordData[5].trim();
    workout.distance = currentRecordData[7].trim();
    workout.time = currentRecordData[12].trim();
    workout.rpe = currentRecordData[43].trim();
    workout.feeling = currentRecordData[44].trim().slice(0, -1); // remove trailing " char

    this.setIcon(workout);

    console.log(workout);
    return workout;
  }

  setIcon(workout: Workout) {
    if (workout.type === 'X-Train') {
      if (workout.title.toLowerCase().includes('rock climbing'))
        workout.icon = 'climbing';
    }
    else
      workout.icon = workout.type.toLowerCase();
  }
}