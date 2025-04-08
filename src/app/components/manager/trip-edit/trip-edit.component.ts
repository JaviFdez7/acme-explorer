import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../../../services/trip.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';
import { AccordionModule } from 'primeng/accordion';
import { StepperModule } from 'primeng/stepper';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trip-edit',
  imports: [CommonModule, ButtonModule, InputTextModule, IftaLabelModule, CardModule, ReactiveFormsModule, TextareaModule, AccordionModule, StepperModule],
  templateUrl: './trip-edit.component.html',
  styleUrl: './trip-edit.component.css'
})
export class ManagerTripEditComponent implements OnInit {
  tripForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  @Input() trip: Trip | undefined;
  @Input() manager: Actor | null = null;
  currentStep = 1;
  stages!: FormArray;
  formReady = false;


  constructor(private fb: FormBuilder, private tripService: TripService, 
    private route: Router, private router: ActivatedRoute,
    private actorService: ActorService, private authService: AuthService) {
  }

  ngOnInit() {
      const id = this.router.snapshot.paramMap.get('tripId'); 
      if (id) {
        this.tripService.getTrip(id).subscribe((trip: Trip | undefined) => {
          this.trip = trip
          if (this.trip) {
            this.actorService.getActor(this.trip.manager).subscribe((actor: Actor | undefined) => {
              this.manager = actor || null;
              this.editForm();
            }
            );
          }
        });
      }
    }

  editForm() {
    const startDate = this.getStartDate('en');
    const endDate = this.getEndDate('en');
    this.tripForm = this.fb.group({
      title: [this.trip?.title, Validators.required],
      description: [this.trip?.description, Validators.required],
      startDate: [startDate, [Validators.required, this.validateDateNotInThePast.bind(this), this.validateEndDateAfterStartDate.bind(this)]],
      endDate: [endDate, [Validators.required, this.validateEndDateAfterStartDate.bind(this), this.validateDateNotInThePast.bind(this)]],
      requirements: this.fb.array(
        (this.trip?.requirements || []).map(req => new FormControl(req,[Validators.required, this.noWhitespaceValidator])),
        this.minRequirementsValidator 
      ),
      pictures: this.fb.array(
        (this.trip?.pictures || []).map(pic => new FormControl(pic))
      ),
    });

    this.stages = this.fb.array(
      (this.trip?.stages || []).map(stage =>
        this.fb.group({
          title: [stage.title, Validators.required],
          description: [stage.description, Validators.required],
          price: [stage.price, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
        })
      )
    );
    this.formReady = true;
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

  disableNextStep() {
    if (this.currentStep === 1) {
      return this.tripForm.invalid;
    } else if (this.currentStep === 2) {
      return this.stages.length === 0 || this.stages.invalid || this.loading;
    }
    return true;
  }

  calculateTotalPrice() {
    return this.stages.controls.reduce((sum, stage) => sum + (stage.value.price || 0), 0);
  }
  
  minRequirementsValidator(control: AbstractControl): Record<string, boolean> | null {
    const formArray = control as FormArray;
    return formArray.controls.length > 0 ? null : { 'minRequirements': true };
  }

  noWhitespaceValidator(control: FormControl): Record<string, boolean> | null {
    if (control.value && control.value.trim().length === 0) {
      return { 'whitespace': true }; 
    }
    return null; 
  }

  async onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;
    if (this.trip === undefined) {
      this.error = 'Trip not found';
      this.loading = false;
      return;
    }
    const managerId = this.authService.getCurrentId();
    const managerRole = this.authService.getCurrentRole();
    if (!managerId || managerRole !== 'MANAGER') {
      this.loading = false;
      this.error = 'You are not authorized to edit this trip.';
      return;
    }
    const pictures = this.tripForm.value.pictures || [];
    if (pictures.length === 0) {
      pictures.push('https://placehold.co/600x400?text=No+Image')
    }
    const newVersion = this.trip?.version + 1;
    if (this.tripForm.valid) {
      const trip = new Trip(
        this.trip?.ticker,
        managerId,
        this.tripForm.value.title,
        this.tripForm.value.description,
        this.calculateTotalPrice(),
        new Date(this.tripForm.value.startDate),
        new Date(this.tripForm.value.endDate),
        this.tripForm.value.requirements,
        this.tripForm.value.pictures,
        this.trip?.cancelation,
        newVersion,
        this.trip?.deleted,
        this.stages.value,
      );
      const id = this.router.snapshot.paramMap.get('tripId');
      if (!id) {
        console.error('Trip ID not found');
        return;
      }

      this.tripService.editTrip(trip, id).then(() => {
        this.loading = false;
        this.success = 'Trip edited successfully!';
        this.error = null;
        this.tripForm.reset(); 
        this.route.navigate(['/manager/'+ managerId + '/trips']); 
      }
      ).catch((error) => {
        this.loading = false;
        this.error = 'Error editing trip: ' + error.message;
        console.error('Error editing trip:', error);
      });
    } else {
      this.tripForm.markAllAsTouched(); 
      this.loading = false;
      this.error = 'Please fill in all required fields.';
      console.log('Form is invalid');
      this.success = null;
    }
  }

  onReset() {
    this.editForm();
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

  getStartDate(lan: string): string {
    const rawDate: Date | { seconds: number } = this.trip?.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
  
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
  
    return `${year}-${month}-${day}`; 
  }
  
  getEndDate(lan: string): string {
    const rawDate: Date | { seconds: number } = this.trip?.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();  
  
    return `${year}-${month}-${day}`; 
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
