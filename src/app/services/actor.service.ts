import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Actor } from '../models/actor.model';
import { map, Observable  } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private actorsCollection;

  constructor(private firestore: AngularFirestore) { 
    this.actorsCollection = this.firestore.collection<Actor>('actors');
  }

  getActors(): Observable<Actor[]> {
    return this.actorsCollection.valueChanges();
  }

  getManagers(): Observable<Actor[]> {
    return this.actorsCollection.valueChanges().pipe(
      map(actors => actors.filter(actor => actor.role === 'MANAGER'))
    );
  }
}
