import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManagerTripCreateComponent } from './trip-create.component';
import { ReactiveFormsModule, FormsModule, FormArray, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { generate, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TripService } from '../../../services/trip.service';
import { AuthService } from '../../../services/auth.service';

describe('ManagerTripCreateComponent', () => {
  let component: ManagerTripCreateComponent;
  let fixture: ComponentFixture<ManagerTripCreateComponent>;

  const mockTripService = {
    addTrip: jasmine.createSpy('addTrip').and.returnValue(Promise.resolve({})),
    generateUniqueTicker: jasmine.createSpy('generateUniqueTicker').and.returnValue(Promise.resolve('251225-ABCD')),
  };

  const mockAuthService = {
    getCurrentId: jasmine.createSpy('getCurrentId').and.returnValue('12345'),
    getCurrentRole: jasmine.createSpy('getCurrentRole').and.returnValue('MANAGER'),
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ManagerTripCreateComponent, // como es standalone, va aquí
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        MessageService,
        { provide: TripService, useValue: mockTripService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ManagerTripCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.tripForm).toBeDefined();
    expect(component.tripForm.get('title')).toBeTruthy();
    expect(component.tripForm.get('title')?.value).toEqual('');
  });

  it('should be invalid when form is empty', () => {
    component.tripForm.reset();
    expect(component.tripForm.valid).toBeFalse();
  });

  it('should add a stage to the stages FormArray', () => {
    const stagesArray = component.stages as FormArray;
    const initialLength = stagesArray?.value.length || 0;

    expect(component.stages).toBeTruthy();

    component.addStage();

    expect(stagesArray?.value.length).toBe(initialLength + 1);
  });
  it ('should remove a stage from the stages FormArray', () => {
    const stagesArray = component.stages as FormArray;
    const initialLength = stagesArray?.value.length || 0;

    component.addStage();
    expect(stagesArray?.value.length).toBe(initialLength + 1);

    component.removeStage(0); 
    expect(stagesArray?.value.length).toBe(initialLength);
  });
  it('should create a trip with valid data', async () => {
    component.tripForm.patchValue({
      title: 'Test Trip',
      description: 'A great adventure',
      startDate: new Date('2025-12-25').toISOString(),
      endDate: new Date('2025-12-26').toISOString(), 
      requirements: [],
      pictures: [],
    });

    component.addRequirement();
    const requirement = component.requirements.at(0);
    requirement.patchValue('Be awesome');
    expect(component.tripForm.valid).toBeTrue();
    
  
    component.addStage();
    const stage = component.stages.at(0);
    stage.patchValue({
      title: 'Stage 1',
      description: 'Explore the jungle',
      price: 100
    });
    
    expect(component.stages.valid).toBeTrue();
  
    await component.onSubmit();

    expect(mockAuthService.getCurrentId).toHaveBeenCalled();
    expect(mockAuthService.getCurrentRole).toHaveBeenCalled();
    expect(mockTripService.generateUniqueTicker).toHaveBeenCalled();
    expect(mockTripService.addTrip).toHaveBeenCalled();
  });
  it('should not submit the form if invalid prices', async () => {
    component.tripForm.patchValue({
      title: 'Test Trip',
      description: 'A great adventure',
      startDate: new Date('2025-12-25').toISOString(),
      endDate: new Date('2025-12-26').toISOString(), 
      requirements: [],
      pictures: [],
    });

    component.addRequirement();
    const requirement = component.requirements.at(0);
    requirement.patchValue('Be awesome');
    expect(component.tripForm.valid).toBeTrue();

    component.addStage();
    const stage = component.stages.at(0);
    stage.patchValue({
      title: 'Stage 1',
      description: 'Explore the jungle',
      price: -100 // Invalid price
    });
    
    expect(component.stages.valid).toBeFalse();
  
    await component.onSubmit();

    expect(component.tripForm.valid).toBeFalse();
  });
  it('should not submit the form if invalid dates', async () => {
    component.tripForm.patchValue({
      title: 'Test Trip',
      description: 'A great adventure',
      startDate: new Date('2025-12-26').toISOString(), // Start date after end date
      endDate: new Date('2025-12-25').toISOString(),  
      requirements: [],
      pictures: [],
    });

    component.addRequirement();
    const requirement = component.requirements.at(0);
    requirement.patchValue('Be awesome');

    component.addStage();
    const stage = component.stages.at(0);
    stage.patchValue({
      title: 'Stage 1',
      description: 'Explore the jungle',
      price: 100
    });

    expect(component.stages.valid).toBeTrue();

    await component.onSubmit();

    expect(component.tripForm.valid).toBeFalse();
  });
});
