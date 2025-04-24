import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SponsorshipConfig } from '../models/sponsorship-config.model';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SponsorshipConfigService {
  private sponsorshipConfigCollection;
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor() {
    this.sponsorshipConfigCollection = this.firestore.collection<SponsorshipConfig>('sponsorshipConfig');
  }

  getOrCreateSponsorshipConfig(): Observable<SponsorshipConfig> {
    return runInInjectionContext(this.injector, () => {
      return this.sponsorshipConfigCollection.valueChanges({ idField: 'id' }).pipe(
        switchMap((configs) => {
          if (configs.length > 0) {
            return from([configs[0]]);
          } else {
            const defaultConfig = new SponsorshipConfig(0, 0, false);
            return from(this.sponsorshipConfigCollection.add(defaultConfig.object)).pipe(
              map(() => defaultConfig)
            );
          }
        }),
        map((config) => config as SponsorshipConfig)
      );
    });
  }

  updateSponsorshipConfig(id: string, sponsorshipConfig: SponsorshipConfig): Promise<void> {
    return this.sponsorshipConfigCollection.ref.doc(id).update(sponsorshipConfig.object);
  }
}
