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
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Application } from '../../../models/application.model';
import { ApplicationService } from '../../../services/application.service';
import { Badge } from 'primeng/badge';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { SponsorshipBannerComponent } from '../../sponsor/sponsorship-banner/sponsorship-banner.component';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-manager-trip-details',
  imports: [ImageCarouselComponent, DividerModule, CommonModule, ButtonModule, MessageModule, TableModule, Badge, CountdownModule, SponsorshipBannerComponent],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class ManagerTripDetailsComponent implements OnInit{
  protected trip: Trip | undefined;
  protected manager: Actor | null = null;
  protected applicationsNumbers: number[] = [0, 0, 0, 0]; 
  protected applications: Application[] = [];
  countdownTime = 0;
  countdownConfig: CountdownConfig | null = null;
  countdownCompleted = false;
  currentChange: string = '$';

  constructor(
    private tripService: TripService,
    private actorService: ActorService,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private locateService: LocateService
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
          });
          this.applicationService.getApplicationsByTrip(tripId).subscribe((applications) => {
            this.applications = applications.filter((application) => application.actor !== this.trip?.manager);
          });
          const startDate = this.trip.startDate instanceof Timestamp
            ? this.trip.startDate.toDate()
            : new Date(this.trip.startDate);

          const now = new Date();
          const diffInSeconds = Math.floor((startDate.getTime() - now.getTime()) / 1000);
          const CountdownTimeUnits: [string, number][] = [
            ['Y', 1000 * 60 * 60 * 24 * 365], // years
            ['M', 1000 * 60 * 60 * 24 * 30], // months
            ['D', 1000 * 60 * 60 * 24], // days
            ['H', 1000 * 60 * 60], // hours
            ['m', 1000 * 60], // minutes
            ['s', 1000], // seconds
            ['S', 1], // million seconds
          ];

          if (diffInSeconds > 0) {
            this.countdownConfig = {
              leftTime: diffInSeconds,
              format: 'ddd:HH:mm:ss',
              formatDate: ({ date }) => {
                let totalSeconds = Math.floor(date / 1000); // <- IMPORTANTE: convertir de ms a s
            
                const days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
            
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
            
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
            
                return `${days}d ${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
              }
            };            
          }
        }
        this.applicationService.getApplicationsGroupedByStatusPerTrip(tripId).subscribe((applications: any[]) => {
          this.applicationsNumbers = applications.map((group) => group.applications.length);
        })
      });
    }

    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€'); 
    });
  }
  
  handleCountdownEvent(event: any) {
    if (event.action === 'done') {
      this.countdownCompleted = true;
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

        const language = this.locateService.getCurrentLanguageValue();
        const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
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

        const language = this.locateService.getCurrentLanguageValue();
        const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
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
      const applicationAccepted = this.applications.some((application) => application.status === 'ACCEPTED');
      return !cancelled || this.canDoOperation(numDays) || applicationAccepted; // Disable button if trip is cancelled or if the difference is less than numDays
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
        true,
        this.trip.stages
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

  goApplications() {
    this.router.navigate(['trip', this.trip?.id, 'applications']);
  }
}
