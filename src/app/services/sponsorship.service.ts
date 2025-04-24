import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Sponsorship } from '../models/sponsorship';

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

  getSponsorshipsBySponsor(sponsor: string) {
    return this.firestore.collection<Sponsorship>('sponsorships', ref => ref.where('sponsor', '==', sponsor)).valueChanges({ idField: 'id' });
  }

  createSponsorship(sponsorship: Sponsorship): Promise<unknown> {
    return this.sponsorshipsCollection.add(sponsorship.object);
  }

  getSponsorshipById(id: string) {
    return runInInjectionContext(this.injector, () => {
      return this.sponsorshipsCollection.doc<Sponsorship>(id).valueChanges({ idField: 'id' });
    });
  }

  updateSponsorship(sponsorship: Sponsorship, id: string): Promise<void> {
    return this.sponsorshipsCollection.ref.doc(id).update(sponsorship.object);
  }
}
