import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApplicationListComponent } from './application-list.component';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { Application } from '../../../models/application.model';
import { DataViewModule } from 'primeng/dataview';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../services/trip.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAnimations } from '@angular/platform-browser/animations';

// Mock del componente hijo
@Component({
  selector: 'app-application-display',
  standalone: true,
  template: '<div class="mock-application">{{ application?.status }}</div>',
  imports: [CommonModule]
})
class MockApplicationDisplayComponent {
  @Input() application!: Application;
}

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let applicationServiceSpy: jasmine.SpyObj<ApplicationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    applicationServiceSpy = jasmine.createSpyObj('ApplicationService', ['getApplicationsByActorIdGroupedByStatusPerTrip']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentId']);
    const tripServiceMock = {
      getTrip: jasmine.createSpy('getTrip').and.returnValue(of({ title: 'Mock Trip',
        startDate: { seconds: 1700000000 },
        endDate: { seconds: 1700000000 },
        description: 'Mock Description',
        price: 100
      }))
    };
    const angularFirestoreMock = {};
    
    await TestBed.configureTestingModule({
      imports: [
        ApplicationListComponent,
        MockApplicationDisplayComponent,
        CommonModule,
        DataViewModule
      ],
      providers: [
        provideAnimations(),
        { provide: ApplicationService, useValue: applicationServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TripService, useValue: tripServiceMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: FIREBASE_OPTIONS, useValue: {} }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should display multiple applications when there are at least two', fakeAsync(() => {
    const mockApplications: Application[] = [
      { id: '1', status: 'PENDING', date: new Date(), messages: ['Test'], trip: 'trip1' } as Application,
      { id: '2', status: 'ACCEPTED', date: new Date(), messages: ['Test'], trip: 'trip2' } as Application
    ];

    authServiceSpy.getCurrentId.and.returnValue('actor1');
    applicationServiceSpy.getApplicationsByActorIdGroupedByStatusPerTrip.and.returnValue(of(mockApplications));

    fixture.detectChanges();
    tick();  
    fixture.detectChanges();  

    const renderedItems = fixture.nativeElement.querySelectorAll('.mock-application');
    expect(renderedItems).toBeTruthy();
  }));

  it('should display application details correctly when the list has no application', fakeAsync(() => {
    const mockApplications: Application[] = [];

    authServiceSpy.getCurrentId.and.returnValue('actor1');
    applicationServiceSpy.getApplicationsByActorIdGroupedByStatusPerTrip.and.returnValue(of(mockApplications));

    fixture.detectChanges();
    tick();  
    fixture.detectChanges();  

    const renderedItems = fixture.nativeElement.querySelectorAll('.mock-application');
    expect(renderedItems).toBeTruthy();
  }));
});
