import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Trip } from '../models/trip.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private tripsCollection;

  constructor(private firestore: AngularFirestore) {
    this.tripsCollection = this.firestore.collection<Trip>('trips');
  }

  getTrips(): Observable<Trip[]> {
    return this.tripsCollection.valueChanges({ idField: 'id' });
  }

  getTrip(id: string): Observable<Trip | undefined> {
    return this.tripsCollection.doc<Trip>(id).valueChanges({ idField: 'id' });
  }

  addTrip(trip: Trip): Promise<unknown> {
    return this.tripsCollection.add(trip.object);
  }
}