import { Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';

export const routes: Routes = [
  { path: '', component: TripDisplayComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }
]

