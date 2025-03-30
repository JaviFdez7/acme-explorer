import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripDisplayComponent } from '../trip-display/trip-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { TripService } from '../../../services/trip.service';

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, TripDisplayComponent, DataView],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  protected tripList: Trip[] = [];

  constructor(private tripService: TripService) { }

  ngOnInit() {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.tripList = trips;
    });
  }

  getTripList() {
    return this.tripList;
  }
  
  getTrip(index: number) {
    return this.tripList[index];
  }
  
  getTripCount() {
    return this.tripList.length;
  }
}
