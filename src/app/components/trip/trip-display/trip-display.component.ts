import { Component } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ImageCarouselComponent } from "../../img-carousel/img-carousel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-display',
  imports: [ImageCarouselComponent, CommonModule],
  templateUrl: './trip-display.component.html',
  styleUrl: './trip-display.component.css'
})
export class TripDisplayComponent  {
  protected trip: Trip;

  constructor() { 
    this.trip = new Trip();
    this.trip.ticker = '57-AB32';
    this.trip.title = 'Trip to the moon';
    this.trip.description = 'A trip to the moon to see the stars. A once in a lifetime opportunity!';
    this.trip.price = 1000;
    this.trip.requirements = ['18+', 'Passport', 'Vaccination', 'Insurance', 'Space suit'];
    this.trip.startDate = new Date();
    this.trip.endDate = new Date();
    this.trip.pictures = [
      { itemImageSrc: `https://placehold.co/600x400?text=${this.trip.title.split(' ').join('+')}+1`, alt: 'Image 1' },
      { itemImageSrc: `https://placehold.co/600x400?text=${this.trip.title.split(' ').join('+')}+2`, alt: 'Image 2' },
      { itemImageSrc: `https://placehold.co/600x400?text=${this.trip.title.split(' ').join('+')}+3`, alt: 'Image 3' },
      { itemImageSrc: `https://placehold.co/600x400?text=${this.trip.title.split(' ').join('+')}+4`, alt: 'Image 4' },

    ];
    this.trip.deleted = false;
  }

  getRequirements() {
    return this.trip.requirements;
  }

  getPictures() {
    return this.trip.pictures;
  }

  getStartDate(lan: string) {
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(this.trip.startDate);
  }

  getEndDate(lan: string) {
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(this.trip.endDate);
  }
}
