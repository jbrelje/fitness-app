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

  constructor(
    private service: DataService,
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
    this.service.getFormattedData().subscribe(data => {
      this.dataSource.data = data;
    });
  }
}