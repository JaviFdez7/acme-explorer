import { Component, Input, OnInit } from '@angular/core';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-application-display',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './application-display.component.html',
  styleUrl: './application-display.component.css'
})
export class ApplicationDisplayComponent implements OnInit {
  @Input() application: Application;
  protected trip: Trip | undefined;

  constructor(private router: Router, private authService: AuthService, private tripService: TripService) {
    this.application = new Application("tripId", "actorId", ["message1", "message2"], ApplicationStatus.PENDING, new Date(), "nigga", 0, false);
  }

  ngOnInit() {
    this.tripService.getTrip(this.application.trip).subscribe((trip: Trip | undefined) => {
      this.trip = trip;
    });
  }

  getStatus() {
    return this.application.status;
  }

  getMessages() {
    return this.application.messages;
  }

  getReason() {
    return this.application.reason;
  }

  getDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.application.date as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
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

  goToTrip() {
    this.router.navigate(['/trip', this.application.trip]);
  }
}
