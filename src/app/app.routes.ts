import { Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { TripListComponent } from './components/trip/trip-list/trip-list.component';
import { HomeComponent } from './components/shared/home/home.component';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { LoginComponent } from './components/security/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trip', component: TripDisplayComponent },
  { path: 'trips', component: TripListComponent },
  { path: 'register', component: RegisterComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' } },
  { path: 'login',component: LoginComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' }},
  { path: '**', component: NotFoundComponent }
]

