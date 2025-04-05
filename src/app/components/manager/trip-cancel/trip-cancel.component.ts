import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TripService } from '../../../services/trip.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from '../../../models/trip.model';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-trip-cancel',
  imports: [CommonModule, CardModule, IftaLabelModule, ReactiveFormsModule, ButtonModule, TextareaModule],
  templateUrl: './trip-cancel.component.html',
  styleUrl: './trip-cancel.component.css'
})
export class ManagerTripCancelComponent implements OnInit{
  tripForm!: FormGroup;
  trip: Trip | undefined;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private tripService: TripService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('tripId');
    if(id) {
      this.tripService.getTrip(id).subscribe((trip) => {
        this.trip = trip;
        this.cancelForm();
      });
    }
  }

  cancelForm() {
    this.tripForm = new FormGroup({
      reason: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    const id = this.route.snapshot.paramMap.get('tripId');
    if (this.tripForm.valid && this.trip && id) {
      this.loading = true;
      this.error = null;
      this.success = null;
      this.tripForm.disable();
      const reason = this.tripForm.value.reason;
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
        reason
      );
      this.tripService.editTrip(newTrip, id).then(() => {
        this.loading = false;
        this.success = 'Trip cancelled successfully!';
        this.tripForm.reset();
        console.log(this.success);
        this.router.navigate(['/manager', this.trip?.manager, 'trips']);
      }).catch((error) => {
        this.loading = false;
        console.error('Error cancelling trip:', error);
      });
    } else {
      this.loading = false;
      this.success = null;
      this.error = 'Form is invalid or trip is undefined';
      this.tripForm.markAllAsTouched();
      console.log(this.error);
    }
  }

  onReset() {
    this.tripForm.reset();
    this.tripForm.enable();
    this.error = null;
    this.success = null;
  }
}
