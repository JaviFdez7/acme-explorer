import { Routes } from '@angular/router';
import { RegisterComponent } from './components/security/register/register.component';
import { RegisterExplorerComponent } from './components/security/register-explorer/register-explorer.component';
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
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProfileComponent } from './components/security/profile/profile.component';
import { ApplicationListManagerComponent } from './components/manager/application-list/application-list.component';
import { SponsorshipCreateComponent } from './components/sponsor/sponsorship-create/sponsorship-create.component';
import { SponsorshipListComponent } from './components/sponsor/sponsorship-list/sponsorship-list.component';
import { SponsorshipDetailsComponent } from './components/sponsor/sponsorship-details/sponsorship-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trips', component: TripListComponent },
  { path: 'trip', component: TripDisplayComponent },
  { path: 'trip/create', component: ManagerTripCreateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'trip/:id', component: TripDetailsComponent },
  { path: 'trip/:id/applications', component: ApplicationListManagerComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'trip/:id/edit', component: TripDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'trip/:id/apply', component: ApplicationCreateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'list/:id', component: TripDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'user/:id/profile', component: ProfileComponent },
  { path: 'explorer/:id/applications', component: ApplicationListComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/applications/:applicationId', component: ApplicationDetailsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/applications/:applicationId/edit', component: ApplicationDetailsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'explorer/:id/favorites', component: TripDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'explorer' } },
  { path: 'manager/:id/trips', component: ManagerTripListComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId/edit', component: ManagerTripEditComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId/cancel', component: ManagerTripCancelComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'manager/:id/trip/:tripId', component: ManagerTripDetailsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'manager' } },
  { path: 'admin/create-user', component: RegisterComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/sponsor-configuration', component: TripDisplayComponent },
  { path: 'admin/explorer-analysis', component: TripDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'admin' } },
  { path: 'sponsor/:id/sponsorships', component: SponsorshipListComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/create', component: SponsorshipCreateComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/:id', component: SponsorshipDetailsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'sponsor' } },
  { path: 'sponsorship/:id/edit', component: TripDisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'sponsor' } },
  { path: 'register', component: RegisterExplorerComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' } },
  { path: 'login', component: LoginComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' } },
  { path: 'denied-access', component: DeniedAccessComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
]

