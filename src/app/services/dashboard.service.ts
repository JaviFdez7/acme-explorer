import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip } from '../models/trip.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private tripsCollection;
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() {
    this.tripsCollection = this.firestore.collection<Trip>('trips');
  }

  getTripsByEachManager(): Observable<any[]> {
    return this.getMockTrips().pipe(
      // Replace with this.tripsCollection
      map((managerTrips) => {
        const groupedTrips = managerTrips.reduce((acc, trip) => {
          const managerId = trip.manager;
          if (!acc[managerId]) {
            acc[managerId] = { managerId, trips: [] };
          }
          acc[managerId].trips.push(trip);
          return acc;
        }, {});

        return Object.values(groupedTrips);
      })
    );
  }

  // Average, minimum, maximum, and standard deviation of the number of trips managed per manager.
  getTripsByEachManagerStats(): Observable<any> {
    return this.getTripsByEachManager().pipe(
      map((managerTrips) => {
        if (!managerTrips || managerTrips.length === 0) {
          return { average: "-", min: "-", max: "-", stdDev: "-" };
        }
        const tripCounts = managerTrips.map((manager) => manager.trips.length);
        const totalTrips = tripCounts.reduce((sum, count) => sum + count, 0);
        const average = Number((totalTrips / tripCounts.length).toFixed(2));
        const min = Math.min(...tripCounts);
        const max = Math.max(...tripCounts);
        const stdDev = Math.sqrt(
          tripCounts.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / tripCounts.length
        ).toFixed(2);
        return { average, min, max, stdDev };
      })
    );
  }

  getApplicationsByEachTrip(): Observable<any[]> {
    return this.getMockApplications().pipe(
      // Replace with this.firestore.collection('trips')
      map((trips) => {
        const groupedTrips = trips.reduce((acc, trip) => {
          const tripId = trip.trip;
          if (!acc[tripId]) {
            acc[tripId] = { ...tripId, applications: [] };
          }
          acc[tripId].applications.push(trip);
          return acc;
        }, {});

        return Object.values(groupedTrips);
      })
    );
  }

  // Average, minimum, maximum, and standard deviation of the number of applications managed per trip.
  getApplicationsByEachTripStats(): Observable<any> {
    return this.getApplicationsByEachTrip().pipe(
      map((tripApplications) => {
        if (!tripApplications || tripApplications.length === 0) {
            return { average: "-", min: "-", max: "-", stdDev: "-" };
        }
        const applicationCounts = tripApplications.map((trip) => trip.applications.length);
        const totalApplications = applicationCounts.reduce((sum, count) => sum + count,0);
        const average = Number((totalApplications / applicationCounts.length).toFixed(2));
        const min = Math.min(...applicationCounts);
        const max = Math.max(...applicationCounts);
        const stdDev = Math.sqrt(
          applicationCounts.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / applicationCounts.length
        ).toFixed(2);
        return { average, min, max, stdDev };
      }));
  }

  // Average, minimum, maximum, and standard deviation of the price of trips.
  getTripsPriceStats(): Observable<any> {
    return this.getMockTrips().pipe( // Replace with this.firestore.collection('trips')
      map((trips) => {
        if (!trips || trips.length === 0) {
            return { average: "-", min: "-", max: "-", stdDev: "-" };
        }
        const tripPrices = trips.map((trip) => trip.price);
        const totalPrice = tripPrices.reduce((sum, price) => sum + price, 0);
        const average = Number((totalPrice / tripPrices.length).toFixed(2));
        const min = Math.min(...tripPrices);
        const max = Math.max(...tripPrices);
        const stdDev = Math.sqrt(
          tripPrices.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / tripPrices.length
        ).toFixed(2);
        return { average, min, max, stdDev };
      }));
  }

  // Group applications by status
  getApplicationsByEachStatus(): Observable<any[]> {
    return this.getMockApplications().pipe(// Replace with this.firestore.collection('applications')
      map((applications) => {
        const groupedApplications = applications.reduce((acc, application) => {
          const status = application.status;
          if (!acc[status]) {
            acc[status] = { status, applications: [] };
          }
          acc[status].applications.push(application);
          return acc;
        }, {});

        return Object.values(groupedApplications);
      }));
  }

  getMockTrips(): Observable<any[]> {
    return of([
      {
        id: 't1',
        destination: 'Madrid',
        manager: 'm1',
        date: '2025-01-01',
        price: 100,
      },
      {
        id: 't2',
        destination: 'Barcelona',
        manager: 'm1',
        date: '2025-01-15',
        price: 120,
      },
      {
        id: 't3',
        destination: 'Valencia',
        manager: 'm2',
        date: '2025-02-10',
        price: 90,
      },
      {
        id: 't4',
        destination: 'Sevilla',
        manager: 'm2',
        date: '2025-02-20',
        price: 110,
      },
      {
        id: 't5',
        destination: 'Bilbao',
        manager: 'm2',
        date: '2025-03-01',
        price: 130,
      },
      {
        id: 't6',
        destination: 'Granada',
        manager: 'm3',
        date: '2025-03-15',
        price: 95,
      },
      {
        id: 't7',
        destination: 'Zaragoza',
        manager: 'm4',
        date: '2025-04-01',
        price: 105,
      },
      {
        id: 't8',
        destination: 'Toledo',
        manager: 'm4',
        date: '2025-04-10',
        price: 115,
      },
      {
        id: 't9',
        destination: 'Málaga',
        manager: 'm5',
        date: '2025-05-05',
        price: 125,
      },
      {
        id: 't10',
        destination: 'Cádiz',
        manager: 'm5',
        date: '2025-05-15',
        price: 135,
      },
      {
        id: 't11',
        destination: 'Alicante',
        manager: 'm5',
        date: '2025-06-01',
        price: 140,
      },
      {
        id: 't12',
        destination: 'Santander',
        manager: 'm5',
        date: '2025-06-10',
        price: 150,
      },
    ]);
  }

  getMockApplications(): Observable<any[]> {
    return of([
      {
        date: '2025-01-01',
        status: 'PENDING',
        trip: 't1',
      },
      {
        date: '2025-01-02',
        status: 'PENDING',
        trip: 't1',
      },
      {
        date: '2025-01-03',
        status: 'PENDING',
        trip: 't3',
      },
      {
        date: '2025-01-01',
        status: 'DUE',
        trip: 't4',
      },
      {
        date: '2025-01-02',
        status: 'DUE',
        trip: 't5',
      },
      {
        date: '2025-01-01',
        status: 'ACCEPTED',
        trip: 't1',
      },
      {
        date: '2025-01-02',
        status: 'ACCEPTED',
        trip: 't2',
      },
      {
        date: '2025-01-03',
        status: 'ACCEPTED',
        trip: 't3',
      },
      {
        date: '2025-01-01',
        status: 'REJECTED',
        trip: 't4',
      },
      {
        date: '2025-01-02',
        status: 'REJECTED',
        trip: 't5',
      },
      {
        date: '2025-01-04',
        status: 'PENDING',
        trip: 't1',
      },
      {
        date: '2025-01-05',
        status: 'DUE',
        trip: 't2',
      },
      {
        date: '2025-01-06',
        status: 'ACCEPTED',
        trip: 't3',
      },
      {
        date: '2025-01-07',
        status: 'REJECTED',
        trip: 't4',
      },
      {
        date: '2025-01-08',
        status: 'PENDING',
        trip: 't5',
      },
    ]);
  }
}