import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Timestamp } from 'firebase/firestore';
import { ImageCarouselComponent } from '../../img-carousel/img-carousel.component';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-details',
  imports: [CommonModule, DividerModule, ImageCarouselComponent, MessageModule, ButtonModule, TableModule],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit {
  protected trip: Trip | undefined;
  protected manager: Actor | null = null;

  constructor(
    private tripService: TripService,
    private actorService: ActorService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripService.getTrip(id).subscribe((trip: Trip | undefined) => {
        this.trip = trip;
        if (this.trip) {
          this.actorService.getActor(this.trip.manager).subscribe((actor: Actor | undefined) => {
            this.manager = actor || null;
          });
        }
      });
    }
  }

  getRequirements() {
    return this.trip?.requirements ?? [];
  }

  getPictures() {
    return this.trip?.pictures ?? [];
  }

  getStartDate(lan: string): string {
    if (!this.trip?.startDate) return 'N/A';

    try {
      const date = this.trip.startDate instanceof Timestamp
        ? this.trip.startDate.toDate()
        : new Date(this.trip.startDate);

      const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
      return formatter.format(date);
    } catch (error) {
      console.error('Error formatting start date:', error);
      return 'Invalid Date';
    }
  }

  isExplorer(): boolean {
    return this.authService.isExplorer();
  }

  isTripApplicable(): boolean {
    if (!this.trip) return false;
    const currentDate = new Date();
    const tripStartDate = this.trip.startDate instanceof Timestamp
      ? this.trip.startDate.toDate()
      : new Date(this.trip.startDate);
    return !this.trip.cancelation && !this.trip.deleted && tripStartDate > currentDate;
  }

  goApply() {
    if (this.trip && this.trip.id) {
      this.router.navigate(['/trip', this.trip.id, 'apply']);
    }
  }

  getEndDate(lan: string) {
    if (!this.trip?.endDate) return 'N/A';
    try {
      const date = this.trip.endDate instanceof Timestamp
        ? this.trip.endDate.toDate()
        : new Date(this.trip.endDate);

      const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
      return formatter.format(date);
    }
    catch (error) {
      console.error('Error formatting end date:', error);
      return 'Invalid Date';
    }
  }
}