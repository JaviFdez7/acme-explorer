import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { DataView } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { TripDisplayComponent } from '../../trip/trip-display/trip-display.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manager-trip-list',
  imports: [InputIconModule, ButtonModule, TripDisplayComponent, IconField, FormsModule, DataView, CommonModule, InputTextModule],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class ManagerTripListComponent implements OnInit {
protected tripList: Trip[] = [];
  protected searchQuery ='';
  protected currentManager: string | null = null;

  constructor(private tripService: TripService, private authService: AuthService, private route: Router) { }

  ngOnInit() {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.tripList = trips;
    });
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentManager = user.uid;
      } else {
        this.currentManager = null;
      }
    });
  }

  filteredTrips() {

    return this.tripList.filter(trip => {
      const query = this.searchQuery.toLowerCase();
      return ( trip.title.toLowerCase().includes(query) ||
             trip.ticker.toLowerCase().includes(query) ||
             trip.description.toLowerCase().includes(query) ) && trip.manager === this.currentManager ;
    });
  }

  clearSearch() {
    this.searchQuery = '';
  }

  addTrip() {
    this.route.navigate(['/trip/create']);
  }
}
