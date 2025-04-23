import { Component, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { TripDisplayComponent } from '../trip-display/trip-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { TripService } from '../../../services/trip.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../../../services/auth.service';
import { FinderService } from '../../../services/finder.service';
import { Finder } from '../../../models/finder.model';

@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, TripDisplayComponent, DataView, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  protected tripList: Trip[] = [];
  protected filteredTripList: Trip[] = [];
  protected searchQuery = '';
  protected minPrice: number | null = null;
  protected maxPrice: number | null = null;
  protected startDate: string | null = null;
  protected endDate: string | null = null;
  protected cacheExpirationHours = 1; 
  private cachedCriteria: any = null; 
  protected errorMessages: string[] = []; 
  protected maxResults = 10;

  constructor(private tripService: TripService, private authService: AuthService, private finderService: FinderService) {}

  ngOnInit() {
    this.loadCache();
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.tripList = trips;
      if (!this.filteredTripList.length) {
        this.performSearch(); // Perform search only after trips are loaded
      }
    });
  }

  performSearch() {
    this.errorMessages = [];

    const currentCriteria = {
      searchQuery: this.searchQuery,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      startDate: this.startDate,
      endDate: this.endDate
    };

    // Validation: Cache expiration must be between 1 and 24 hours
    if (this.cacheExpirationHours < 1 || this.cacheExpirationHours > 24) {
      this.errorMessages.push('Cache expiration must be between 1 and 24 hours.');
    }

    // Validation: Maximum results must be between 10 and 50
    if (this.maxResults < 10 || this.maxResults > 50) {
      this.errorMessages.push('Maximum results must be between 10 and 50.');
    }

    // Validation: Minimum price cannot be greater than maximum price
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
      this.errorMessages.push('Minimum price cannot be greater than maximum price.');
    }

    // Validation: Dates must be in the future
    const now = new Date();
    if (this.startDate && new Date(this.startDate) < now) {
      this.errorMessages.push('Start date must be in the future.');
    }
    if (this.endDate && new Date(this.endDate) < now) {
      this.errorMessages.push('End date must be in the future.');
    }

    // Validation: Start date must be earlier than or equal to end date
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      this.errorMessages.push('Start date cannot be later than end date.');
    }

    // If there are validation errors, stop the search
    if (this.errorMessages.length > 0) {
      return;
    }

    if (this.isCriteriaCached(currentCriteria)) {
      // Use cached results if criteria match
      console.log('Using cached results');
      return;
    }

    // Perform a new search if criteria have changed
    this.filteredTripList = this.tripList.filter(trip => {
      const rawDate: Date | { seconds: number } = trip.startDate as Date | { seconds: number };
      const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
      const query = this.searchQuery.toLowerCase();
      const price = trip.price;

      const matchesKeyword = query === '' || trip.title.toLowerCase().includes(query) || trip.ticker.toLowerCase().includes(query) || trip.description.toLowerCase().includes(query);
      const matchesPrice = (this.minPrice === null || price >= this.minPrice) && (this.maxPrice === null || price <= this.maxPrice);
      const matchesDate = (this.startDate === null || date >= new Date(this.startDate)) && (this.endDate === null || date <= new Date(this.endDate));

      return matchesKeyword && matchesPrice && matchesDate && trip.deleted === false && date > new Date();
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, this.maxResults);

    if(this.authService.isExplorer() && !this.checkEmptyCriteria()) {
      const newFinder = new Finder('', this.searchQuery || '', this.minPrice as number, this.maxPrice as number, this.startDate as string, this.endDate as string, 0, false);
      this.finderService.addFinder(newFinder).then(() => {
        console.log('Finder added successfully');
      })
    }
    this.cachedCriteria = currentCriteria;
    this.saveCache();
  }

  private isCriteriaCached(currentCriteria: any): boolean {
    if (!this.cachedCriteria) {
      return false;
    }
    return JSON.stringify(this.cachedCriteria) === JSON.stringify(currentCriteria);
  }

  private saveCache() {
    const cacheData = {
      filteredTripList: this.filteredTripList,
      cachedCriteria: this.cachedCriteria,
      timestamp: new Date().getTime(),
      cacheExpirationHours: this.cacheExpirationHours
    };
    localStorage.setItem('tripCache', JSON.stringify(cacheData));
  }

  private loadCache() {
    const cache = localStorage.getItem('tripCache');
    if (cache) {
      const cacheData = JSON.parse(cache);
      const now = new Date().getTime();
      const cacheAge = (now - cacheData.timestamp) / (1000 * 60 * 60);

      if (cacheAge <= cacheData.cacheExpirationHours) {
        this.filteredTripList = cacheData.filteredTripList;
        this.cachedCriteria = cacheData.cachedCriteria;
        this.cacheExpirationHours = cacheData.cacheExpirationHours;

        if (this.cachedCriteria) {
          this.searchQuery = this.cachedCriteria.searchQuery || '';
          this.minPrice = this.cachedCriteria.minPrice || null;
          this.maxPrice = this.cachedCriteria.maxPrice || null;
          this.startDate = this.cachedCriteria.startDate || null;
          this.endDate = this.cachedCriteria.endDate || null;
        }
      } else {
        localStorage.removeItem('tripCache'); // Clear expired cache
      }
    }
  }

  checkEmptyCriteria() {
    return this.searchQuery === '' && this.minPrice === null && this.maxPrice === null && this.startDate === null && this.endDate === null;
  }

  filteredTrips() {
    return this.filteredTripList;
  }

  clearSearch() {
    this.searchQuery = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.startDate = null;
    this.endDate = null;
    this.performSearch();
    this.cachedCriteria = {
      searchQuery: '',
      minPrice: null,
      maxPrice: null,
      startDate: null,
      endDate: null
    }
  }

  setCacheExpiration(hours: number) {
    if (hours >= 1 && hours <= 24) {
      this.cacheExpirationHours = hours;
      this.saveCache();
    }
  }

  setMaxResults(value: number) {
    if (value >= 10 && value <= 50) {
      this.maxResults = value;
    }
  }

  getTripList() {
    return this.tripList;
  }
  
  getTrip(index: number) {
    return this.tripList[index];
  }
  
  getTripCount() {
    return this.tripList.length;
  }
}
