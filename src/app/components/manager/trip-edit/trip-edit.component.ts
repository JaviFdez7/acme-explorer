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

@Component({
  selector: 'app-trip-edit',
  imports: [CommonModule, ButtonModule, CardModule, ReactiveFormsModule, IftaLabelModule, InputTextModule, TextareaModule],
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

  constructor(private fb: FormBuilder, private tripService: TripService, 
    private route: Router, private router: ActivatedRoute,
    private actorService: ActorService) {
  }

  ngOnInit() {
      const id = this.router.snapshot.paramMap.get('tripId'); 
      if (id) {
        this.tripService.getTrips().subscribe((trips: Trip[]) => {
          this.trip = trips.find(trip => trip.id === id);
          if (this.trip) {
            this.actorService.getManagers().subscribe((actors: Actor[]) => {
              this.manager = actors.find(actor => actor.id === this.trip?.manager) ?? null;
              this.editForm();
            });
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
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
      requirements: this.fb.array(
        (this.trip?.requirements || []).map(req => new FormControl(req,[Validators.required, this.noWhitespaceValidator])),
        this.minRequirementsValidator 
      ),
      price: [this.trip?.price, [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('^[0-9]*$')]],
      pictures: this.fb.array(
        (this.trip?.pictures || []).map(pic => new FormControl(pic))
      ),
    });
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
    const managerId = this.trip?.manager;
    if (!managerId) {
      console.error('Manager ID not found');
      return;
    }
    const pictures = this.tripForm.value.pictures;
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
        this.tripForm.value.price,
        new Date(this.tripForm.value.startDate),
        new Date(this.tripForm.value.endDate),
        this.tripForm.value.requirements,
        this.tripForm.value.pictures,
        this.trip?.cancelation,
        this.trip?.published,
        newVersion,
        this.trip?.deleted
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
  
  
}
