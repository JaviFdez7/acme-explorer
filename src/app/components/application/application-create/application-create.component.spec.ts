import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApplicationCreateComponent } from './application-create.component';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { TripService } from '../../../services/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Trip } from '../../../models/trip.model';
import { Application } from '../../../models/application.model';
import { Stage } from '../../../models/stage.model';

describe('ApplicationCreateComponent - apply to future trip', () => {
  let component: ApplicationCreateComponent;
  let fixture: ComponentFixture<ApplicationCreateComponent>;
  let mockApplicationService: jasmine.SpyObj<ApplicationService>;
  let mockTripService: jasmine.SpyObj<TripService>;
  const mockAuthService = {
    getCurrentId: jasmine.createSpy().and.returnValue('user123'),
  };
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockApplicationService = jasmine.createSpyObj('ApplicationService', ['getApplicationByActorAndTrip', 'addApplication']);
    mockTripService = jasmine.createSpyObj('TripService', ['getTrip']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        ApplicationCreateComponent,
        FormBuilder,
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: TripService, useValue: mockTripService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 'trip123' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationCreateComponent);
    component = fixture.componentInstance;

    mockAuthService.getCurrentId.and.returnValue('user123');
    mockApplicationService.getApplicationByActorAndTrip.and.returnValue(of([]));
  });

  it('should submit application for a future trip', fakeAsync(() => {
    const futureTrip: Trip = new Trip('251225-ACME', 
      'user123',
      'Future Trip',
      'A trip in the future',
      1000,
      new Date('2026-12-25'),
      new Date('2026-12-31'),
      ['Must be 18+'],
      [],
      '',
      1,
      false,
      [new Stage('Stage 1', 'Description', 1000)]
    );

    mockTripService.getTrip.and.returnValue(of(futureTrip));
    mockApplicationService.addApplication.and.returnValue(Promise.resolve());

    fixture.detectChanges(); 

    component.addMessage();
    component.messages.at(0).setValue('Hello, I want to join!');
    fixture.detectChanges();

    component.onSubmit();
    tick(); 

    expect(mockApplicationService.addApplication).toHaveBeenCalledWith(
      new Application('trip123', 'user123', ['Hello, I want to join!'])
    );
    expect((component as any).success).toBe('Application submitted successfully');
    expect((component as any).error).toBeNull();
    expect((component as any).loading).toBeFalse();

    tick(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explorer', 'user123', 'applications']);
  }));
  // Con un trip pasado no se podría aplicar, pero esa limitación ya se hace desde el display de un trip. Por lo tanto esa funcionalidad
  // no se puede testear en un test de componente.
});
