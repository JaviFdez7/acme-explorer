import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ApplicationService } from '../../../services/application.service';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-cube-trip-display',
  templateUrl: './cube-trip-display.component.html',
  styleUrls: ['./cube-trip-display.component.css']
})
export class CubeTripDisplayComponent implements OnInit {
  @Input() trip!: Trip;
  @Input() explorerId!: string;

  applicationDate: Date | null = null;
  currentChange: string = '$';


  constructor(private applicationService: ApplicationService, private locateService: LocateService) {}

  ngOnInit(): void {
    this.applicationService.getApplicationByActorAndTrip(this.explorerId, this.trip.id).subscribe(applications => {
      if (applications.length > 0) {
        const timestamp = applications[0].date;
        this.applicationDate = this.convertTimestampToDate(timestamp);
      }
    })

    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€'); 
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
      const language = this.locateService.getCurrentLanguageValue();
      const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' });
      return formatter.format(this.applicationDate);
    } catch (error) {
      console.error('Error formatting application date:', error);
      return 'Invalid Date';
    }
  }
}
