import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManagerTripCreateComponent } from './trip-create.component';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { TripService } from '../../../services/trip.service';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Trip } from '../../../models/trip.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

const routes: Routes = [
  { path: 'manager/:id/trips', component: DummyComponent }
];
describe('ManagerTripCreateComponent', () => {
  let component: ManagerTripCreateComponent;
  let fixture: ComponentFixture<ManagerTripCreateComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const tripSpy = jasmine.createSpyObj('TripService', ['addTrip', 'generateUniqueTicker']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentId', 'getCurrentRole']);

    await TestBed.configureTestingModule({
      imports: [
        ManagerTripCreateComponent, // ✅ Así se importa un componente standalone
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes(routes),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TripService, useValue: tripSpy },
        { provide: AuthService, useValue: authSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerTripCreateComponent);
    component = fixture.componentInstance;
    tripServiceSpy = TestBed.inject(TripService) as jasmine.SpyObj<TripService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authServiceSpy.getCurrentId.and.returnValue('manager-id-123');
    authServiceSpy.getCurrentRole.and.returnValue('MANAGER');
    tripServiceSpy.generateUniqueTicker.and.returnValue(Promise.resolve('UNIQUE-TICKER'));

    fixture.detectChanges();
  });

  it('should create a valid trip: "Jungle party"', fakeAsync(async () => {
    component.tripForm.patchValue({
      title: 'Jungle party',
      description: 'A wild trip into the jungle',
      startDate: '2025-09-20',
      endDate: '2025-10-01',
    });
  
    component.addRequirement();
    component.requirements.at(0).setValue('Must love monkeys');
  
    component.addPicture();
    component.pictures.at(0).setValue('https://example.com/image.jpg');
  
    component.addStage();
    component.stages.at(0).patchValue({
      title: 'Stage 1',
      description: 'Explore the jungle',
      price: 1000,
    });
  
    tripServiceSpy.addTrip.and.returnValue(Promise.resolve());
  
    await component.onSubmit();
    tick();
  
  
    expect(component.success).toBe('Trip added successfully!');
    expect(tripServiceSpy.addTrip).toHaveBeenCalled();
  
  }));
  

  it('should fail if end date is before start date', fakeAsync(() => {
    component.tripForm.patchValue({
      title: 'Short Trip',
      description: 'Testing invalid date',
      startDate: '2025-10-01',
      endDate: '2025-09-20'
    });

    component.addRequirement();
    component.requirements.at(0).setValue('Req');

    component.addStage();
    component.stages.at(0).patchValue({
      title: 'Stage 1',
      description: 'Some description',
      price: 100
    });

    component.onSubmit();
    tick();

    const startDateErrors = component.tripForm.get('startDate')?.errors;
    const endDateErrors = component.tripForm.get('endDate')?.errors;

    expect(startDateErrors?.['endDateBeforeStartDate'] || endDateErrors?.['endDateBeforeStartDate']).toBeTruthy();
    expect(tripServiceSpy.addTrip).not.toHaveBeenCalled();
  }));
});