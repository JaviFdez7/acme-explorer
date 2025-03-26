import { Component } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripDisplayComponent } from '../trip-display/trip-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, TripDisplayComponent, DataView],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class TripListComponent  {
  protected tripList: Trip[] = [];

  constructor() { 
    for (let i = 0; i < 10; i++) {
      const trip = new Trip();
      trip.ticker = '57-AB3'+i;
      trip.title = 'Trip '+i;
      trip.description = 'A trip to the moon to see the stars. A once in a lifetime opportunity!';
      trip.price = 1000 + i;
      trip.requirements = ['18+', 'Passport', 'Vaccination', 'Insurance', 'Space suit'];
      trip.startDate = new Date();
      trip.endDate = new Date();
      trip.pictures = [
        { itemImageSrc: `https://placehold.co/600x400?text=${trip.title.split(' ').join('+')}+1`, alt: 'Image 1' },
        { itemImageSrc: `https://placehold.co/600x400?text=${trip.title.split(' ').join('+')}+2`, alt: 'Image 2' },
        { itemImageSrc: `https://placehold.co/600x400?text=${trip.title.split(' ').join('+')}+3`, alt: 'Image 3' },
        { itemImageSrc: `https://placehold.co/600x400?text=${trip.title.split(' ').join('+')}+4`, alt: 'Image 4' },

      ];
      trip.deleted = false;
      this.tripList.push(trip);
    }
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
