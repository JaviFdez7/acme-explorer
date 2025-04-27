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
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { SponsorshipBannerComponent } from '../../sponsor/sponsorship-banner/sponsorship-banner.component';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-trip-details',
  imports: [CommonModule, DividerModule, ImageCarouselComponent, MessageModule, ButtonModule, TableModule, CountdownModule, SponsorshipBannerComponent],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit {
  protected trip: Trip | undefined;
  protected manager: Actor | null = null;
  countdownTime = 0;
  countdownConfig: CountdownConfig | null = null;
  countdownCompleted = false;
  currentChange: string = '$';

  constructor(
    private tripService: TripService,
    private actorService: ActorService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private locateService: LocateService
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

  goAddToList() {
    if (this.trip && this.trip.id) {
      this.router.navigate(['/favourite-list', 'add', this.trip.id]);
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
}