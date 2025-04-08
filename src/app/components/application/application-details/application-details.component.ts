import { Component, OnInit } from '@angular/core';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trip.model';
import { ApplicationService } from '../../../services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-application-details',
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, DialogModule, ReactiveFormsModule, IftaLabelModule, TextareaModule, MessageModule],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.css'
})
export class ApplicationDetailsComponent implements OnInit {
  protected application: Application | undefined;
  protected trip: Trip | undefined;
  protected cancelForm!: FormGroup;
  protected isVisibleCancelDialog = false;
  protected isVisiblePayDialog = false;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private tripService: TripService, private applicationService: ApplicationService, private fb: FormBuilder) {
    this.application = new Application("", "");
    this.trip = new Trip("", "", "", "", 0, new Date(), new Date(), [], []);
    this.cancelForm = new FormGroup({
      reason: new FormControl('', { validators: [Validators.required, Validators.maxLength(400)] }),
    });
  }

  ngOnInit() {
    console.log(this.cancelForm);
    this.applicationService.getApplication(this.route.snapshot.params['applicationId']).subscribe((application: Application | undefined) => {
      if (!application) {
        this.router.navigate(['/not-found']);
        return;
      }
      this.application = application;
      this.tripService.getTrip(this.application.trip).subscribe((trip: Trip | undefined) => {
        this.trip = trip;
      });
    });
  }

  getApplicationStatus() {
    return this.application?.status;
  }

  getApplicationDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.application?.date as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    return formatter.format(date);
  }

  getTripStartDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip?.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getTripEndDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip?.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  getTripTitle() {
    return this.trip?.title || '';
  }

  getTripDescription() {
    return this.trip?.description || '';
  }

  getTripTicker() {
    return this.trip?.ticker || '';
  }

  getTripPrice() {
    return this.trip?.price || 0;
  }

  getApplicationMessages() {
    return this.application?.messages;
  }

  getApplicationReason() {
    return this.application?.reason || '';
  }

  isApplicationCancelable() {
    return this.application?.status === ApplicationStatus.PENDING || this.application?.status === ApplicationStatus.DUE;
  }

  goTripDetails() {
    this.router.navigate(['/trip', this.application?.trip]);
  }

  async pay() {
    if (this.application && this.trip) {
      const updatedApplication = new Application(this.application.trip, this.application.actor, this.application.messages, ApplicationStatus.ACCEPTED, this.application.date, "", this.application.version + 1)

      await this.applicationService.editApplication(this.application.id, updatedApplication).then(() => {
        this.router.navigate(['/explorer', this.authService.getCurrentId() || "", "applications"])
      }).catch((error) => {
        console.error('Error updating application:', error);
      }
      )
    }
  }

  showCancelDialog() {
    this.isVisibleCancelDialog = true;
  }

  async cancel() {
    if (this.application && this.trip) {
      if (this.cancelForm.invalid) {
        this.cancelForm.markAllAsTouched();
        return;
      }
      const updatedApplication = new Application(this.application.trip, this.application.actor, this.application.messages, ApplicationStatus.REJECTED, this.application.date, this.cancelForm.value.reason, this.application.version + 1)

      await this.applicationService.editApplication(this.application.id, updatedApplication).then(() => {
        this.router.navigate(['/explorer', this.authService.getCurrentId() || "", "applications"])
      }).catch((error) => {
        console.error('Error updating application:', error);
      }
      )
    } else {
      console.error('Application or trip is undefined');
    }
  }

  getApplicationStatusClass() {
    switch (this.application?.status) {
      case ApplicationStatus.PENDING:
        return 'bg-blue-600 text-blue-100';
      case ApplicationStatus.DUE:
        return 'bg-yellow-600 text-yellow-100';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-600 text-green-100';
      case ApplicationStatus.REJECTED:
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-primary-300 text-primary-950';
    }
  }
}