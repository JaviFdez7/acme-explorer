import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../../../services/trip.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-manager-trip-create',
  imports: [CommonModule, ButtonModule, InputTextModule, IftaLabelModule, CardModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './trip-create.component.html',
  styleUrl: './trip-create.component.css'
})
export class ManagerTripCreateComponent {
  tripForm!: FormGroup;
  loading = false;
  error : string | null = null;
  success : string | null = null;

  constructor(private fb : FormBuilder, private tripService: TripService, private authService: AuthService, private route: Router) {
    this.createForm();
  }

  createForm() {
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      requirements: this.fb.array([], Validators.required),
      price: ['', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('^[0-9]*$')]],
      pictures: this.fb.array([]),
    });
  }

  async onSubmit() {
    if (this.tripForm.valid) {
      this.loading = true;
      this.error = null; 
      const managerId = this.authService.getCurrentActor()?.id;
      if (!managerId) {
        console.error('Manager ID not found');
        return;
      }
      const ticker = await this.tripService.generateUniqueTicker();
      const pictures = this.tripForm.value.pictures
      if (pictures.length === 0) {
        pictures.push('https://placehold.co/600x400?text=No+Image')
      }
      const trip = new Trip(
        ticker,
        managerId,
        this.tripForm.value.title,
        this.tripForm.value.description,
        this.tripForm.value.price,
        new Date(this.tripForm.value.startDate),
        new Date(this.tripForm.value.endDate),
        this.tripForm.value.requirements,
        this.tripForm.value.pictures,
        undefined,
        false
      )

      this.tripService.addTrip(trip).then(() => {
        this.loading = false;
        this.success = 'Trip added successfully!';
        this.error = null;
        this.tripForm.reset(); 
        this.route.navigate(['/manager/'+ managerId + '/trips']); // Navigate to the trip list page after successful addition
      }).catch((error) => {
        this.loading = false;
        this.error = 'Error adding trip: ' + error.message;
        console.error('Error adding trip:', error);
      });
    } else {
      this.tripForm.markAllAsTouched(); 
      this.loading = false;
      console.log('Form is invalid');
    }
  }

  onReset() {
    this.tripForm.reset();
  }

  get requirements() {
    return this.tripForm.get('requirements') as FormArray;
  }

  addRequirement() {
    this.requirements.push(new FormControl('', Validators.required));
  }

  removeRequirement(index: number) {
    this.requirements.removeAt(index);
  }

  get pictures() {
    return this.tripForm.get('pictures') as FormArray;
  }

  addPicture() {
    this.pictures.push(new FormControl('', Validators.required));
  }

  removePicture(index: number) {
    this.pictures.removeAt(index);
  }

}
