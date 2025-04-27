import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-favourite-list-trip-display',
  templateUrl: './favourite-list-trip-display.component.html',
  imports: [ButtonModule, CardModule, CommonModule],
  styleUrls: ['./favourite-list-trip-display.component.css']
})
export class FavouriteListTripDisplayComponent implements OnInit {
  @Input() trip: any;
  @Input() listId!: string;
  currentChange: string = '$';

  constructor(private router: Router, private favouriteListService: FavouriteListService, private locateService: LocateService) {}

  ngOnInit() {
    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€'); 
    });
  }

  getStartDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getEndDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  goDetails() {
    this.router.navigate(['/trip', this.trip.id]);
  }

  deleteTrip() {
    this.favouriteListService.deleteTripFromList(this.listId, this.trip.id).then(() => {
    })
  }

  startsInLessThanAWeek(): boolean {
    const today = new Date();
    const rawDate: Date | { seconds: number } = this.trip.startDate as Date | { seconds: number };
    const startDate = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const timeDiff = startDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff < 7 && daysDiff >= 0;
  }

  isExpired(): boolean {
    const today = new Date();
    const rawDate: Date | { seconds: number } = this.trip.endDate as Date | { seconds: number };
    const endDate = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    return endDate < today;
  }
}
