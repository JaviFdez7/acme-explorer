import { Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { HomeComponent } from './components/shared/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trip', component: TripDisplayComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }
]

