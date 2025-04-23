import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Application } from '../models/application.model';
import { map, Observable } from 'rxjs';
import { ApplicationStatus } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationsCollection;
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() {
    this.applicationsCollection = this.firestore.collection<Application>('applications');
  }

  getApplications(): Observable<Application[]> {
    return this.applicationsCollection.valueChanges({ idField: 'id' });
  }

  getApplication(id: string): Observable<Application | undefined> {
    return runInInjectionContext(this.injector, () => {
      return this.applicationsCollection.doc<Application>(id).valueChanges({ idField: 'id' });
    });
  }

  addApplication(application: Application): Promise<unknown> {
    return this.applicationsCollection.add(application.object);
  }

  editApplication(id: string, application: Application): Promise<void> {
    return this.applicationsCollection.ref.doc(id).update(application.object);
  }

  getApplicationsByActor(actorId: string): Observable<Application[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection<Application>('applications', ref => ref.where('actor', '==', actorId)).valueChanges({ idField: 'id' });
    });
  }

  getApplicationsByTrip(tripId: string): Observable<Application[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection<Application>('applications', ref => ref.where('trip', '==', tripId)).valueChanges({ idField: 'id' });
    });
  }

  getApplicationByActorAndTrip(actorId: string, tripId: string): Observable<Application[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection<Application>('applications', ref => ref.where('actor', '==', actorId).where('trip', '==', tripId)).valueChanges({ idField: 'id' });
    });
  }

  getApplicationsGroupedByStatusPerTrip(tripId: string): Observable<any[]> {
    return this.getApplicationsByTrip(tripId).pipe(
      map(applications => {
        const groupedApplications: { status: ApplicationStatus; applications: Application[] }[] = [
          { status: ApplicationStatus.PENDING, applications: [] },
          { status: ApplicationStatus.DUE, applications: [] },
          { status: ApplicationStatus.ACCEPTED, applications: [] },
          { status: ApplicationStatus.REJECTED, applications: [] }
        ];
        applications.forEach(application => {
          const index = groupedApplications.findIndex(group => group.status === application.status);
          if (index !== -1)
            groupedApplications[index].applications.push(application);
        });
        return groupedApplications;
      })
    )
  }  

  getApplicationsByActorIdGroupedByStatusPerTrip(actorId: string): Observable<any[]> {
    return this.getApplicationsByActor(actorId).pipe(
      map(applications => {
        const groupedApplications: { status: ApplicationStatus; applications: Application[] }[] = [
          { status: ApplicationStatus.PENDING, applications: [] },
          { status: ApplicationStatus.DUE, applications: [] },
          { status: ApplicationStatus.ACCEPTED, applications: [] },
          { status: ApplicationStatus.REJECTED, applications: [] }
        ];
        applications.forEach(application => {
          const index = groupedApplications.findIndex(group => group.status === application.status);
          if (index !== -1)
            groupedApplications[index].applications.push(application);
        });
        return groupedApplications;
      })
    )
  }
}


