import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TripService } from './trip.service';
import { ApplicationService } from './application.service';
import { FinderService } from './finder.service';
import { Finder } from '../models/finder.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private tripsCollection;
  private applicationsCollection;
  private findersCollection;

  constructor(private tripService: TripService, private applicationService: ApplicationService, private finderService: FinderService) {
    this.tripsCollection = tripService.getTrips();
    this.applicationsCollection = applicationService.getApplications();
    this.findersCollection = finderService.getFinders();
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

  getFindersStats(): Observable<any> {
    return combineLatest([
      this.getAverageMinimumPrice(),
      this.getAverageMaximumPrice(),
      this.getTopKeyWords()
    ]).pipe(
      map(([averageMinPrice, averageMaxPrice, topKeyWords]) => ({
        averageMinPrice,
        averageMaxPrice,
        topKeyWords
      }))
    );
  }

  getAverageMinimumPrice(): Observable<any> {
    return this.finderService.getFinders().pipe(
      map((finders: Finder[]) => {
        const validFinders = finders.filter(finder => finder.minPrice !== null && finder.minPrice >= 0);
        if(validFinders.length === 0) {
          return '-'; 
        }
        const totalMinPrice = validFinders.reduce((sum, finder) => sum + (finder.minPrice || 0), 0);
        return (totalMinPrice / validFinders.length).toFixed(2);
      })
    );
  }

  getAverageMaximumPrice(): Observable<any> {
    return this.finderService.getFinders().pipe(
      map((finders: Finder[]) => {
        const validFinders = finders.filter(finder => finder.maxPrice !== null && finder.maxPrice >= 0);
        if(validFinders.length === 0) {
          return '-'; 
        }
        const totalMaxPrice = validFinders.reduce((sum, finder) => sum + (finder.maxPrice || 0), 0);
        return (totalMaxPrice / validFinders.length).toFixed(2);
      })
    );
  }

  //The top 10 key words that the explorers indicate in their finders. 
  getTopKeyWords(): Observable<any[]> {
    return this.findersCollection.pipe(
      map((finders: Finder[]) => {
        const validFinders = finders.filter(finder => finder.searchQuery !== null && finder.searchQuery.trim() !== '');
        const keywordsCount: { [key: string]: number } = {};

        validFinders.forEach(finder => {
          const keywords = finder.searchQuery.split(',').map(keyword => keyword.trim());
          keywords.forEach(keyword => {
            if (keywordsCount[keyword]) {
              keywordsCount[keyword]++;
            } else {
              keywordsCount[keyword] = 1;
            }
          });
        });

        const sortedKeywords = Object.entries(keywordsCount).sort((a, b) => b[1] - a[1]);
        return sortedKeywords.slice(0, 10).map(([keyword, count]) => ({ keyword, count }));
      })
    );
  }
}