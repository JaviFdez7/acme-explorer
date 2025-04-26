import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { TripService } from './trip.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Application, ApplicationStatus } from '../models/application.model';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class CubeService {
    private tripsCollection;
    private applicationsCollection;
  
    constructor(private tripService: TripService, private applicationService: ApplicationService) {
        this.tripsCollection = tripService.getTrips();
        this.applicationsCollection = applicationService.getApplications();
    }

    computeExplorerSpendingCube(period: string, userId: string): Observable<number> {
        const now = new Date();
        let endDate: Date;
        let startDate: Date;

        if (period.startsWith('M')) {
            const months = parseInt(period.slice(1), 10);
            if (months === 1) {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
            } else {
                startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1); 
                endDate = new Date(now.getFullYear(), now.getMonth() - (months - 1) + 1, 0); 
            }
        } else if (period.startsWith('Y')) {
            const years = parseInt(period.slice(1), 10);
            if (years === 1) {
                startDate = new Date(now.getFullYear(), 0, 1); 
                endDate = new Date(now.getFullYear(), 11, 31); // Last day of the current year
            } else {
                startDate = new Date(now.getFullYear() - (years - 1), 0, 1); 
                endDate = new Date(now.getFullYear() - (years - 1), 11, 31); 
            }
        }
        
        return this.tripsCollection.pipe(
            switchMap((trips: Trip[]) => 
                this.applicationsCollection.pipe(
                    map((applications: Application[]) => {
                        return applications.filter(app => 
                                app.status === ApplicationStatus.ACCEPTED &&
                                app.actor === userId &&
                                this.timestampToDate(app.date) >= startDate &&
                                this.timestampToDate(app.date) <= endDate
                            ).reduce((total, app) => {
                                const trip = trips.find(t => t.id === app.trip);
                                return trip ? total + trip.price : total;
                            }, 0);
                    })
                )
            )
        );
    }

    getTripsAppliedByUserInCubePeriod(period: string, userId: string): Observable<Trip[]> {
        const now = new Date();
        let endDate: Date;
        let startDate: Date;

        if (period.startsWith('M')) {
            const months = parseInt(period.slice(1), 10);
            if (months === 1) {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
            } else {
                startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1); 
                endDate = new Date(now.getFullYear(), now.getMonth() - (months - 1) + 1, 0); 
            }
        } else if (period.startsWith('Y')) {
            const years = parseInt(period.slice(1), 10);
            if (years === 1) {
                startDate = new Date(now.getFullYear(), 0, 1); 
                endDate = new Date(now.getFullYear(), 11, 31); // Last day of the current year
            } else {
                startDate = new Date(now.getFullYear() - (years - 1), 0, 1); 
                endDate = new Date(now.getFullYear() - (years - 1), 11, 31); 
            }
        }

        return this.applicationsCollection.pipe(
            switchMap((applications: Application[]) => 
                this.tripsCollection.pipe(
                    map((trips: Trip[]) => {
                        const filteredApplications = applications.filter(app => 
                            app.status === ApplicationStatus.ACCEPTED &&
                            app.actor === userId &&
                            this.timestampToDate(app.date) >= startDate &&
                            this.timestampToDate(app.date) <= endDate
                        );

                        return filteredApplications.map(app => 
                            trips.find(trip => trip.id === app.trip)
                        ).filter((trip): trip is Trip => !!trip); // Filter out undefined trips
                    })
                )
            )
        );
    }

    private timestampToDate(timestamp: any): Date {
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000);
        }
        return new Date(timestamp); 
    }
}
