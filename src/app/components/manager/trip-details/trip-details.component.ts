import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Actor } from '../../../models/actor.model';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trip.model';
import { ActorService } from '../../../services/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCarouselComponent } from '../../img-carousel/img-carousel.component';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-manager-trip-details',
  imports: [ImageCarouselComponent, DividerModule, CommonModule, ButtonModule],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class ManagerTripDetailsComponent implements OnInit{
  protected trip: Trip | undefined;
  protected manager: Actor | null = null;

  constructor(
    private tripService: TripService,
    private actorService: ActorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const managerId = this.route.snapshot.paramMap.get('id'); 
    const tripId = this.route.snapshot.paramMap.get('tripId'); 

    if (tripId) {
      this.tripService.getTrip(tripId).subscribe((trip: Trip | undefined) => {
        this.trip = trip;
        if (this.trip && managerId) {
          this.actorService.getActor(this.trip.manager).subscribe((actor: Actor | undefined) => {
            this.manager = actor || null;
          }
          );
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

  goEdit() {
    try { 
      this.router.navigate(['manager', this.manager?.id, 'trip', this.trip?.id, 'edit']);
    } catch (error) {
      console.error('Error navigating to edit trip:', error);
    }
  }

  canDoOperation(numDays: number): boolean {
    const today = new Date();
    if (!this.trip?.startDate) return true; // Disable edit if no start date
    const startDate = this.trip.startDate instanceof Timestamp
      ? this.trip.startDate.toDate() 
      : new Date(this.trip.startDate);
    const timeDiff = startDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return startDate < today || daysDiff < numDays; // Disable edit if the trip has started or if the difference is less than numDays
  }

  shouldDisableButton(numDays: number): boolean {
    if (this.trip) {
      const cancelled = this.trip.cancelation.trim() === '' ? true : false;
      return !cancelled || this.canDoOperation(numDays);
    } else {
      return false;
    }
  }

  goCancel() {
    this.router.navigate(['manager', this.manager?.id, 'trip', this.trip?.id, 'cancel']);
  }

  deleteTrip() {
    if (this.trip) {
      const newTrip = new Trip(
        this.trip.ticker,
        this.trip.manager,
        this.trip.title,
        this.trip.description,
        this.trip.price,
        this.trip.startDate,
        this.trip.endDate,
        this.trip.requirements,
        this.trip.pictures,
        undefined,
        this.trip.version + 1,
        true
      );
      const id = this.route.snapshot.paramMap.get('tripId');
      if (!id) {
        console.error('Trip ID not found');
        return;
      }
      this.tripService.editTrip(newTrip, id).then(() => {
        this.router.navigate(['/manager/' + this.manager?.id + '/trips']);
      }).catch((error) => {
        console.error('Error deleting trip:', error);
      });
    } else {
      console.error('Trip not found');
    }
    

  }
}
