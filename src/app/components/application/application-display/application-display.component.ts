import { Component, Input, OnInit } from '@angular/core';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trip.model';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-application-display',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './application-display.component.html',
  styleUrl: './application-display.component.css'
})
export class ApplicationDisplayComponent implements OnInit {
  @Input() application: Application;
  protected trip: Trip | undefined;
  protected currentChange: string = '$';

  constructor(private router: Router, private authService: AuthService, private tripService: TripService, private locateService: LocateService) {
    this.application = new Application("", "");
    this.trip = new Trip("", "", "", "", 0, new Date(), new Date(), [], []);
  }

  ngOnInit() {
    this.tripService.getTrip(this.application.trip).subscribe((trip: Trip | undefined) => {
      this.trip = trip;
    });

    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€'); 
    });
  }

  getApplicationStatus() {
    return this.application.status;
  }

  getApplicationDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.application.date as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    return formatter.format(date);
  }

  getTripStartDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip?.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getTripEndDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip?.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getTripTitle() {
    return this.trip?.title || '';
  }

  getTripTicker() {
    return this.trip?.ticker || '';
  }

  getTripPrice() {
    return this.trip?.price || 0;
  }

  goTripDetails() {
    this.router.navigate(['/trip', this.application.trip]);
  }

  goApplicationDetails() {
    this.router.navigate(['/explorer', this.application.actor, 'applications', this.application.id]);
  }

  getApplicationMessagesInfo() {
    return this.application.messages.length > 0 ? this.application.messages.length + ' messages' : 'No messages';
  }

  getApplicationStatusClass() {
    switch (this.application.status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-600 text-yellow-100';
      case ApplicationStatus.DUE:
        return 'bg-blue-600 text-blue-100';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-600 text-green-100';
      case ApplicationStatus.REJECTED:
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-primary-300 text-primary-950';
    }
  }
}
