import { Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TripDisplayComponent } from './components/trip/trip-display/trip-display.component';
import { TripListComponent } from './components/trip/trip-list/trip-list.component';
import { HomeComponent } from './components/shared/home/home.component';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { LoginComponent } from './components/security/login/login.component';
import { DeniedAccessComponent } from './components/shared/denied-access/denied-access.component';
import { TripDetailsComponent } from './components/trip/trip-details/trip-details.component';
import { ManagerTripListComponent } from './components/manager/trip-list/trip-list.component';
import { ManagerTripCreateComponent } from './components/manager/trip-create/trip-create.component';
import { ManagerTripDetailsComponent } from './components/manager/trip-details/trip-details.component';
import { ManagerTripEditComponent } from './components/manager/trip-edit/trip-edit.component';
import { ManagerTripCancelComponent } from './components/manager/trip-cancel/trip-cancel.component';
import { ApplicationCreateComponent } from './components/application/application-create/application-create.component';
import { ApplicationListComponent } from './components/application/application-list/application-list.component';
import { ApplicationDetailsComponent } from './components/application/application-details/application-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trips', component: TripListComponent },
  { path: 'trip', component: TripDisplayComponent },
  { path: 'trip/create', component: ManagerTripCreateComponent, data: { expectedRole: 'manager' } },
  { path: 'trip/:id', component: TripDetailsComponent },
  { path: 'trip/:id/applications', component: TripDisplayComponent, data: { expectedRole: 'manager' } },
  { path: 'trip/:id/edit', component: TripDisplayComponent, data: { expectedRole: 'manager' } },
  { path: 'trip/:id/apply', component: ApplicationCreateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'list/:id', component: TripDisplayComponent, data: { expectedRole: 'explorer' } },
  { path: 'user/:id/profile', component: TripDisplayComponent },
  { path: 'explorer/:id/applications', component: ApplicationListComponent, data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/applications/:applicationId', component: ApplicationDetailsComponent, data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/applications/:applicationId/edit', component: ApplicationDetailsComponent, data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/favorites', component: TripDisplayComponent, data: { expectedRole: 'explorer' } },
  { path: 'manager/:id/trips', component: ManagerTripListComponent, data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId/edit', component: ManagerTripEditComponent, data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId/cancel', component: ManagerTripCancelComponent, data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId', component: ManagerTripDetailsComponent, data: { expectedRole: 'manager' } },
  { path: 'admin/create-manager', component: TripDisplayComponent, data: { expectedRole: 'admin' } },
  { path: 'admin/create-sponsor', component: TripDisplayComponent, data: { expectedRole: 'admin' } },
  { path: 'admin/dashboard', component: TripDisplayComponent, data: { expectedRole: 'admin' } },
  { path: 'admin/sponsor-configuration', component: TripDisplayComponent },
  { path: 'admin/explorer-analysis', component: TripDisplayComponent, data: { expectedRole: 'admin' } },
  { path: 'sponsor/:id/sponsorships', component: TripDisplayComponent, data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/:id', component: TripDisplayComponent, data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/create', component: TripDisplayComponent, data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/:id/edit', component: TripDisplayComponent, data: { expectedRole: 'sponsor' } },
  { path: 'register', component: RegisterComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' } },
  { path: 'login', component: LoginComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' } },
  { path: 'denied-access', component: DeniedAccessComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
]

