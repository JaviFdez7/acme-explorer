import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-cube-trip-display',
  templateUrl: './cube-trip-display.component.html',
  styleUrls: ['./cube-trip-display.component.css']
})
export class CubeTripDisplayComponent implements OnInit {
  @Input() trip!: Trip;
  @Input() explorerId!: string;

  applicationDate: Date | null = null;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getApplicationByActorAndTrip(this.explorerId, this.trip.id).subscribe(applications => {
      if (applications.length > 0) {
        const timestamp = applications[0].date;
        this.applicationDate = this.convertTimestampToDate(timestamp);
      }
    });
  }

  private convertTimestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6));
    }
    return new Date(timestamp); 
  }

  getApplicationDate(lan: string): string {
    if (!this.applicationDate) return 'N/A';

    try {
      const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
      return formatter.format(this.applicationDate);
    } catch (error) {
      console.error('Error formatting application date:', error);
      return 'Invalid Date';
    }
  }
}
