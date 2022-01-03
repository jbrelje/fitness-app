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

          return workouts.filter(workout => workout.type != 'Day Off');
        })
      );
  }

  parseRecordToWorkout(record: String): Workout {
    console.log("record:" + record);

    let currentRecordData: any[];
    let workout: Workout = new Workout();

    currentRecordData = record.split('","');

    this.setWorkoutData(workout, currentRecordData);
    this.setIcon(workout);
    this.setWorkoutType(workout);

    console.log(workout);
    return workout;
  }

  setWorkoutData(workout: Workout, currentRecordData: any[]) {
    workout.title = currentRecordData[0].trim().substring(1); // remove leading " char
    workout.type = currentRecordData[1].trim();
    workout.date = currentRecordData[5].trim();
    workout.distance = (currentRecordData[7].trim() > 500) ? currentRecordData[7].trim() : 0;
    workout.duration = currentRecordData[12].trim();
    workout.plannedDuration = currentRecordData[3].trim();
    workout.rpe = currentRecordData[43].trim();
    workout.feeling = currentRecordData[44].trim().slice(0, -1); // remove trailing " char
  }

  setIcon(workout: Workout) {
    if (workout.type === 'X-Train' || workout.type === 'Other') {
      if (workout.title.toLowerCase().includes('rock climbing')) workout.icon = 'climbing';
      else if (workout.title.toLowerCase().includes('downhill skiing')) workout.icon = 'downhill-skiing';
      else if (workout.title.toLowerCase().includes('water skiing')) workout.icon = 'water-skiing';
      else if (workout.title.toLowerCase().includes('hiking')) workout.icon = 'hiking';
      else if (workout.title.toLowerCase().includes('mobility') || workout.title.toLowerCase().includes('stretching')) workout.icon = 'stretching';
      else if (workout.title.toLowerCase().includes('basketball')) workout.icon = 'basketball';
      else workout.icon = 'run';
    }
    else workout.icon = workout.type.toLowerCase();
  }

  setWorkoutType(workout: Workout) {
    if (workout.type === 'X-Train' || workout.type === 'Other') {
      if (workout.title.toLowerCase().includes('rock climbing')) workout.type = 'Climbing';
      else if (workout.title.toLowerCase().includes('downhill skiing')) workout.type = 'Downhill Skiing';
      else if (workout.title.toLowerCase().includes('water skiing')) workout.type = 'Water Skiing';
      else if (workout.title.toLowerCase().includes('hiking')) workout.type = 'Hiking';
      else if (workout.title.toLowerCase().includes('mobility') || workout.title.toLowerCase().includes('stretching')) workout.type = 'Mobility';
      else if (workout.title.toLowerCase().includes('basketball')) workout.type = 'Basketball';
      else workout.type = 'Other';
    }
  }
}