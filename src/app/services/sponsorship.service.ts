import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Sponsorship } from '../models/sponsorship';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SponsorshipService {
  private sponsorshipsCollection;
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() {
    this.sponsorshipsCollection = this.firestore.collection<Sponsorship>('sponsorships');
  }

  getSponsorshipsBySponsorId(sponsorId: string): Observable<Sponsorship[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection<Sponsorship>('sponsorships', ref => ref.where('sponsor', '==', sponsorId)).valueChanges({ idField: 'id' });
    })
  };

  createSponsorship(sponsorship: Sponsorship): Promise<unknown> {
    return this.sponsorshipsCollection.add(sponsorship.object);
  }

  getSponsorshipById(id: string): Observable<Sponsorship | undefined> {
    return runInInjectionContext(this.injector, () => {
      return this.sponsorshipsCollection.doc<Sponsorship>(id).valueChanges({ idField: 'id' });
    });
  }

  updateSponsorship(id: string, sponsorship: Sponsorship): Promise<void> {
    return this.sponsorshipsCollection.ref.doc(id).update(sponsorship.object);
  }
}
