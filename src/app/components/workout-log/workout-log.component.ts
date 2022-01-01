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

  columnsToDisplay: string[] = ['icon', 'title', 'type', 'date', 'distance', 'time', 'rpe', 'feeling'];
  dataSource = new MatTableDataSource<Workout>();
  expandedElement: Workout | null;

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
      .addSvgIcon('climbing', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/climbing.svg'));
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
}