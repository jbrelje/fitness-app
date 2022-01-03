import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from "@angular/material/icon";
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from "@angular/platform-browser";
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DataService } from './../../service/data.service';
import { Workout } from './../../models/workout.model';

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class WorkoutLogComponent implements OnInit {

  columnsToDisplay: string[] = ['icon', 'title', 'duration', 'date'];
  dataSource = new MatTableDataSource<Workout>();
  expandedWorkout: Workout | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      .addSvgIcon('climbing', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/climbing.svg'))
      .addSvgIcon('downhill-skiing', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/downhill-skiing.svg'))
      .addSvgIcon('water-skiing', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/water-skiing.svg'))
      .addSvgIcon('hiking', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/hiking.svg'))
      .addSvgIcon('stretching', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/stretching.svg'))
      .addSvgIcon('basketball', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/basketball.svg'))
      .addSvgIcon('walk', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/walk.svg'));
  }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getData() {
    this.service.getFormattedData().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyIconRowBackgroundColor(workout: Workout) {
    let color: string = '';

    if (!workout.plannedDuration) color = '#b5b5b5'; // plain for no planned duration
    else if (workout.duration < workout.plannedDuration * 0.5) color = '#ff8913'; // red(ish)
    else if (workout.duration < workout.plannedDuration * 0.8) color = '#ffc400'; // yellow
    else if (workout.duration > workout.plannedDuration * 1.5) color = '#ff8913'; // red(ish)
    else if (workout.duration > workout.plannedDuration * 1.2) color = '#ffc400'; // yellow
    else color = '#72bb52'; // green

    return { 'background-color': color };
  }

  applyRowBackgroundColor(workout: Workout) {
    let color: string = '';

    if (!workout.plannedDuration) color = '#efefef'; // plain for no planned duration
    else if (workout.duration < workout.plannedDuration * 0.5) color = '#fff0e1'; // red(ish)
    else if (workout.duration < workout.plannedDuration * 0.8) color = '#fffbef'; // yellow
    else if (workout.duration > workout.plannedDuration * 1.5) color = '#fff0e1'; // red(ish)
    else if (workout.duration > workout.plannedDuration * 1.2) color = '#fffbef'; // yellow
    else color = '#edf6e9'; // green

    return { 'background-color': color };
  }

  applyDurationIconClass(workout: Workout) {
    if (!workout.plannedDuration) return 'none'; // plain for no planned duration
    else if (workout.duration < workout.plannedDuration * 0.5) return 'red-arrow-icon'; // red(ish)
    else if (workout.duration < workout.plannedDuration * 0.8) return 'yellow-arrow-icon'; // yellow
    else if (workout.duration > workout.plannedDuration * 1.5) return 'red-arrow-icon'; // red(ish)
    else if (workout.duration > workout.plannedDuration * 1.2) return 'yellow-arrow-icon'; // yellow
    else return 'green-check-icon'; // green
  }

  getDurationIcon(workout: Workout): string {
    if (!workout.plannedDuration) return ''; // plain for no planned duration
    else if (workout.duration < workout.plannedDuration * 0.8) return 'expand_more'; // down arrow
    else if (workout.duration > workout.plannedDuration * 1.2) return 'expand_less'; // up arrow
    else return 'check'; // green
  }
}