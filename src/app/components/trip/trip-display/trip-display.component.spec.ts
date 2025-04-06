import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDisplayComponent } from './trip-display.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActorService } from '../../../services/actor.service';
import { of } from 'rxjs';
import { Trip } from '../../../models/trip.model';
import { By } from '@angular/platform-browser';
import { Actor } from '../../../models/actor.model';

describe('TripDisplayComponent', () => {
  let component: TripDisplayComponent;
  let fixture: ComponentFixture<TripDisplayComponent>;
  let mockActorService: jasmine.SpyObj<ActorService>;

  beforeEach(async () => {
    const actorServiceSpy = jasmine.createSpyObj('ActorService', ['getActor']);

    await TestBed.configureTestingModule({
      imports: [TripDisplayComponent, RouterTestingModule],
      providers: [{ provide: ActorService, useValue: actorServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TripDisplayComponent);
    component = fixture.componentInstance;
    mockActorService = TestBed.inject(ActorService) as jasmine.SpyObj<ActorService>;

    // Datos de prueba
    component.trip = new Trip(
      '1',
      '123',
      'Test Trip',
      'This is a test trip',
      250,
      new Date('2025-04-06'),
      new Date('2025-04-10'),
      ['Camera', 'Boots'],
      ['img1.jpg', 'img2.jpg']
    );
    component.trip.cancelation = 'Trip was cancelled due to weather';

    mockActorService.getActor.and.returnValue(of({
      _name: 'John',
      _surname: 'Doe',
      _role: 'MANAGER',
      _email: 'john.doe@example.com',
      _password: 'password123',
      _phone: '123456789',
      _address: '123 Main St',
      _validated: true,
    } as unknown as Actor));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display trip title', () => {
    const title = fixture.debugElement.query(By.css('h6')).nativeElement.textContent;
    expect(title).toContain('Test Trip');
  });

  it('should show cancelation badge if trip is cancelled', () => {
    const badge = fixture.debugElement.query(By.css('span.bg-primary-50'));
    expect(badge).toBeTruthy();
    expect(badge.nativeElement.textContent).toContain('Cancelled');
  });

  it('should render requirements', () => {
    const reqs = fixture.debugElement.queryAll(By.css('.bg-primary-300'));
    expect(reqs.length).toBe(2);
    expect(reqs[0].nativeElement.textContent).toContain('Camera');
    expect(reqs[1].nativeElement.textContent).toContain('Boots');
  });

  it('should render details button', () => {
    const button = fixture.debugElement.query(By.css('p-button[label="Details"]')).componentInstance;
    expect(button).toBeTruthy();
  });
});
