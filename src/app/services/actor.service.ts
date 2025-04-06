import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Actor } from '../models/actor.model';
import { Observable  } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private actorsCollection;
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() { 
    this.actorsCollection = this.firestore.collection<Actor>('actors');
  }

  getActors(): Observable<Actor[]> {
    return this.actorsCollection.valueChanges();
  }

  getActor(id: string): Observable<Actor | undefined> {
    return runInInjectionContext(this.injector, () => {
      return this.actorsCollection.doc<Actor>(id).valueChanges({ idField: 'id' });
    });
  }
}
