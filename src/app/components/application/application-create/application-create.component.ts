import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from '../../../models/application.model';
import { ApplicationService } from '../../../services/application.service';
import { Trip } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-application-create',
  imports: [CommonModule, ReactiveFormsModule, TextareaModule, CardModule, ButtonModule, IftaLabelModule],
  templateUrl: './application-create.component.html',
  styleUrl: './application-create.component.css'
})
export class ApplicationCreateComponent implements OnInit {
  protected trip: Trip | undefined;
  protected applicationForm!: FormGroup;
  protected loading = false;
  protected error: string | null = null;
  protected success: string | null = null;
  protected userId: string;
  protected tripId: string;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private tripService: TripService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.tripId = this.route.snapshot.params['id'];
    this.userId = this.authService.getCurrentId() || '';
    this.createForm();
  }

  ngOnInit() {
    if (!this.userId || !this.authService.isExplorer()) {
      console.log('User is not an explorer or not logged in');
      this.router.navigate(['/denied-access']);
    }
    if (this.tripId) {

      this.applicationService.getApplicationByActorAndTrip(this.userId, this.tripId).subscribe((applications: Application[]) => {
        if (applications.length > 0) {
          console.log('User has already applied for this trip');
          this.router.navigate(['/explorer', this.userId, 'applications']);
        }
      });
      this.tripService.getTrip(this.tripId).subscribe((trip: Trip | undefined) => {
        if (!trip) {
          this.router.navigate(['/not-found']);
          // } else if (trip.cancelation || trip.deleted || trip.startDate < new Date()) {
          //   console.error('Trip is not available for application');
          this.router.navigate(['/denied-access']);
        } else {
          this.trip = trip;
        }
      });
    }
  }

  createForm() {
    this.applicationForm = this.fb.group({
      messages: this.fb.array([]),
    });
  }

  get messages(): FormArray {
    return this.applicationForm.get('messages') as FormArray;
  }

  addMessage() {
    this.messages.push(new FormControl('', Validators.required));
  }

  removeMessage(index: number) {
    this.messages.removeAt(index);
  }

  async onSubmit() {
    if (this.applicationForm.valid) {
      this.loading = true;
      this.error = null;

      const messages = this.applicationForm.value.messages;

      if (!this.tripId) {
        throw new Error('Trip ID');
      }

      if (!this.userId) {
        throw new Error('User ID');
      }

      const application = new Application(this.tripId, this.userId, messages);

      this.applicationService.addApplication(application).then(() => {
        this.loading = false;
        this.success = 'Application submitted successfully';
        setTimeout(() => {
          this.router.navigate(['/explorer/applications']);
        }, 2000);
      }).catch((error) => {
        console.error('Error submitting application:', error);
        this.loading = false;
        this.error = 'Error submitting application';
      });
    }
  }

  onReset() {
    this.applicationForm.reset();
    this.messages.clear();
    this.success = null;
    this.error = null;
  }
}
