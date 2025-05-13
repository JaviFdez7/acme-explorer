import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ImageCarouselComponent } from "../../img-carousel/img-carousel.component";
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';
import { LocateService } from '../../../services/locate.service';
import { TripService } from '../../../services/trip.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-watchlist-trip-display',
  imports: [ImageCarouselComponent, CommonModule, CardModule, Button, MessageModule, CountdownModule],
  templateUrl: './watchlist-trip-display.component.html',
  styleUrl: './watchlist-trip-display.component.css'
})
export class WatchlistTripDisplayComponent implements OnInit {
  @Input() tripId!: string;
  @Output() tripRemoved = new EventEmitter<string>(); // Notify parent when a trip is removed
  protected trip: Trip | undefined = undefined;
  protected manager: Actor | undefined = undefined;
  protected currentChange: string = '$';
  countdownConfig: CountdownConfig | null = null;
  countdownCompleted = false;

  constructor(
    private router: Router,
    private actorService: ActorService,
    private locateService: LocateService,
    private tripService: TripService
  ) {}

  ngOnInit() {
    this.tripService.getTrip(this.tripId).subscribe((trip: Trip | undefined) => {
      if (trip) {
        this.trip = trip;
        this.actorService.getActor(trip.manager).subscribe((actor: Actor | undefined) => {
          this.manager = actor || undefined;
        });

        const rawDate: Date | { seconds: number } = trip.startDate as Date | { seconds: number };
        const startDate = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
        const now = new Date();
        const diffInSeconds = Math.floor((startDate.getTime() - now.getTime()) / 1000);

        if (diffInSeconds > 0) {
          this.countdownConfig = {
            leftTime: diffInSeconds,
            format: 'ddd:HH:mm:ss',
            formatDate: ({ date }) => {
              let totalSeconds = Math.floor(date / 1000);
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

    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€');
    });
  }

  getRequirements() {
    return this.trip?.requirements || [];
  }

  getPictures() {
    return this.trip?.pictures || [];
  }

  getStartDate(lan: string) {
    if (!this.trip) return '';
    const rawDate: Date | { seconds: number } = this.trip.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getEndDate(lan: string) {
    if (!this.trip) return '';
    const rawDate: Date | { seconds: number } = this.trip.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  goDetails() {
    if (this.trip) {
      this.router.navigate(['/trip', this.trip.id]);
    }
  }

  startsInLessThanAWeek(): boolean {
    if (!this.trip) return false;
    const today = new Date();
    const rawDate: Date | { seconds: number } = this.trip.startDate as Date | { seconds: number };
    const startDate = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const timeDiff = startDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff < 7 && daysDiff >= 0;
  }

  handleCountdownEvent(event: any) {
    if (event.action === 'done') {
      this.countdownCompleted = true;
    }
  }

  removeTripIdFromWatchlistInLocalStorage() {
    const watchlist = localStorage.getItem('watchlist');
    if (watchlist) {
      const watchlistData = JSON.parse(watchlist);
      if (this.trip && this.trip.id) {
        if (watchlistData.tripIds && this.trip?.id) {
          watchlistData.tripIds = (watchlistData.tripIds || []).filter((id: string) => id !== this.trip?.id);
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlistData));
        this.tripRemoved.emit(this.trip.id); // Emit event for real-time update
      }
    }
  }
}
