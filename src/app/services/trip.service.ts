import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Trip } from '../models/trip.model';
import { firstValueFrom, Observable } from 'rxjs';

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

  editTrip(trip: Trip, id: string): Promise<void> {
    return this.tripsCollection.ref.doc(id).update(trip.object);
  }
  
  generateRawTicker(): string {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Get month (01-12)
    const day = today.getDate().toString().padStart(2, '0'); // Get day (01-31)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 4 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const ticker = `${year}${month}${day}-${randomLetters}`;
    return ticker;
  }

  async generateUniqueTicker(): Promise<string> {
    let ticker = this.generateRawTicker();
    let exists = await this.tickerExists(ticker);

    while (exists) {
      console.log('Ticker already exists, generating a new one...');
      ticker = this.generateRawTicker();
      exists = await this.tickerExists(ticker);
    }

    return ticker;
  }

  private async tickerExists(ticker: string): Promise<boolean> {
    try {
      const snapshot = await firstValueFrom(
        this.firestore.collection('trips', ref => ref.where('ticker', '==', ticker)).get()
      );

      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking ticker:', error);
      return false; // Si hay un error, devolvemos false
    }
  }
}