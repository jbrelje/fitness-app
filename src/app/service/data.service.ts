import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataFile: string = '/assets/workouts.csv';

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.dataFile, {responseType: 'text'});
  }

}
