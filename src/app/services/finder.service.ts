import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Finder } from '../models/finder.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinderService {
  private findersCollection;
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() {
    this.findersCollection = this.firestore.collection<Finder>('finders');
  }

  getFinders(): Observable<Finder[]> {
    return this.findersCollection.valueChanges({ idField: 'id' });
  }

  addFinder(finder: Finder): Promise<unknown> {
    return this.findersCollection.add(finder.object);
  }
}
