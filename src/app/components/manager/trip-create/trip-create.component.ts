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
import { AccordionModule } from 'primeng/accordion';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-manager-trip-create',
  imports: [CommonModule, ButtonModule, InputTextModule, IftaLabelModule, CardModule, ReactiveFormsModule, TextareaModule, AccordionModule, StepperModule],
  templateUrl: './trip-create.component.html',
  styleUrl: './trip-create.component.css'
})
export class ManagerTripCreateComponent {
  tripForm!: FormGroup;
  loading = false;
  error : string | null = null;
  success : string | null = null;
  currentStep = 1;
  stages!: FormArray;

  constructor(private fb : FormBuilder, private tripService: TripService, private authService: AuthService, private route: Router) {
    this.createForm();
  }

  createForm() {
    this.tripForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(75)]],
      description: ['', Validators.required],
      startDate: ['', [Validators.required, this.validateDateNotInThePast.bind(this), this.validateEndDateAfterStartDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateEndDateAfterStartDate.bind(this), this.validateDateNotInThePast.bind(this)]],
      requirements: this.fb.array([], Validators.required),
      pictures: this.fb.array([]),
    });

    this.stages = this.fb.array([]);
  }

  get stagesForms() {
    return this.stages.controls as FormGroup[];
  }

  addStage() {
    const stageGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
    });
    this.stages.push(stageGroup);  
  }

  removeStage(index: number) {
    this.stages.removeAt(index);
  }

  calculateTotalPrice() {
    return this.stages.controls.reduce((sum, stage) => sum + (stage.value.price || 0), 0);
  }

  disableNextStep() {
    if (this.currentStep === 1) {
      return this.tripForm.invalid;
    } else if (this.currentStep === 2) {
      return this.stages.length === 0 || this.stages.invalid || this.loading;
    }
    return true;
  }

  async onSubmit() {
    if (this.tripForm.valid) {
      this.loading = true;
      this.error = null; 
      const managerId = this.authService.getCurrentId();
      const managerRole = this.authService.getCurrentRole();
      if (!managerId || managerRole !== 'MANAGER') return;

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
        this.calculateTotalPrice(),
        new Date(this.tripForm.value.startDate),
        new Date(this.tripForm.value.endDate),
        this.tripForm.value.requirements,
        this.tripForm.value.pictures,
        undefined,
        0,
        false,
        this.stages.value,
      )

      this.tripService.addTrip(trip).then(() => {
        this.loading = false;
        this.success = 'Trip added successfully!';
        this.tripForm.reset();
        this.stages.clear();
        this.currentStep = 0;
        this.route.navigate(['/manager/'+ managerId + '/trips']); // Navigate to the trip list page after successful addition
      }).catch((error) => {
        this.loading = false;
        this.error = 'Error adding trip: ' + error.message;
        console.error('Error adding trip:', error);
      });
    } else {
      this.tripForm.markAllAsTouched(); 
      this.stages.markAllAsTouched?.();
      this.loading = false;
      console.log(this.tripForm.errors);
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

  validateDateNotInThePast(control: FormControl) {
    if (!control.value) return null;
  
    const inputDate = this.parseDate(control.value);
    if (!inputDate || isNaN(inputDate.getTime())) {
      console.error('Invalid date:', inputDate);
      return { invalidDate: true };
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
  
    console.log('Input date:', inputDate);
    console.log('Today date:', today);
  
    return inputDate < today ? { dateInThePast: true } : null;
  }
  
  
  validateEndDateAfterStartDate(control: FormControl) {
    if (!this.tripForm) return null;
  
    const startControl = this.tripForm.get('startDate');
    const endControl = this.tripForm.get('endDate');
  
    if (!startControl || !endControl) return null;
  
    if (control === endControl) {
      startControl.updateValueAndValidity();
    }
  
    if (!startControl.value || !endControl.value) return null;
  
    const startDate = this.parseDate(startControl.value);
    const endDate = this.parseDate(endControl.value);
  
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { invalidDate: true };
    }
  
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  
    if (endDate < startDate) {
      return { endDateBeforeStartDate: true };
    }
  
    return null;
  }
  

  private parseDate(value: any): Date | null {
    if (value instanceof Date) return value;
  
    if (typeof value === 'string') {
      const parts = value.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    }
  
    if (value?.seconds) {
      return new Date(value.seconds * 1000);
    }
  
    return null;
  }
  
}
