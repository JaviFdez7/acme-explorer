import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripDisplayComponent } from '../trip-display/trip-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { TripService } from '../../../services/trip.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, TripDisplayComponent, DataView, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  protected tripList: Trip[] = [];
  protected searchQuery ='';

  constructor(private tripService: TripService) { }

  ngOnInit() {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.tripList = trips;
    });
  }

  filteredTrips() {
    
    return this.tripList.filter(trip => {
      const rawDate: Date | { seconds: number } = trip.startDate as Date | { seconds: number };
      const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
      const query = this.searchQuery.toLowerCase();
      return (trip.title.toLowerCase().includes(query) ||
             trip.ticker.toLowerCase().includes(query) ||
             trip.description.toLowerCase().includes(query)) && trip.deleted === false && date > new Date();
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  clearSearch() {
    this.searchQuery = '';
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
