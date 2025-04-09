import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TripService } from './trip.service';
import { ApplicationService } from './application.service';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private tripsCollection;
  private applicationsCollection;

  constructor(private tripService: TripService, private applicationService: ApplicationService) {
    this.tripsCollection = tripService.getTrips();
    this.applicationsCollection = applicationService.getApplications();
  }

  getTripsByEachManager(): Observable<any[]> {
    return this.tripsCollection.pipe(
      map((managerTrips) => {
        const groupedTrips = managerTrips.reduce((acc: { [key: string]: { managerId: string; trips: any[] } }, trip) => {
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
    return combineLatest([this.tripsCollection, this.applicationsCollection]).pipe(
      map(([trips, applications]) => {
        return trips.map(trip => {
          const relatedApplications = applications.filter(app => app.trip === trip.id);
          return {
            trip: trip.id,
            applications: relatedApplications
          };
        });
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
        const totalApplications = applicationCounts.reduce((sum, count) => sum + count, 0);
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
    return this.tripsCollection.pipe(
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
    return this.applicationsCollection.pipe(
      map((applications) => {
        const groupedApplications = applications.reduce((acc: { [key: string]: { status: string; applications: any[] } }, application) => {
          const status = application.status;
          if (!acc[status]) {
            acc[status] = { status, applications: [] };
          }
          acc[status].applications.push(application);
          return acc;
        }, {} as { [key: string]: { status: string; applications: any[] } });

        return Object.values(groupedApplications);
      }));
  }
}