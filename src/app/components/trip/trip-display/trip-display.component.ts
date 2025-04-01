import { Component, Input } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ImageCarouselComponent } from "../../img-carousel/img-carousel.component";
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trip-display',
  imports: [ImageCarouselComponent, CommonModule, CardModule, Button],
  templateUrl: './trip-display.component.html',
  styleUrl: './trip-display.component.css'
})
export class TripDisplayComponent  {
  @Input() trip: Trip;

  constructor(private router: Router) {
    this.trip = new Trip("", "", "", 0, new Date(), new Date(), [], []);
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

  goDetails() {
    this.router.navigate(['/trip', this.trip.id]);
  }
}
