import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { TripService } from '../../../services/trip.service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { FavouriteListTripDisplayComponent } from '../favourite-list-trip-display/favourite-list-trip-display.component';

@Component({
  selector: 'app-favourite-list-details',
  templateUrl: './favourite-list-details.component.html',
  imports: [CommonModule, Button, DataView, FavouriteListTripDisplayComponent],
  styleUrls: ['./favourite-list-details.component.css'],
})
export class FavouriteListDetailsComponent implements OnInit {
  protected favouriteList: any = null;
  protected trips: any[] = [];

  constructor(
    private favouriteListService: FavouriteListService,
    private tripService: TripService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.favouriteListService.favouriteLists$.subscribe((favouriteLists: any[]) => {
        this.favouriteList = favouriteLists.find((list) => list.id === listId);
        if (this.favouriteList?.tripLinks) {
          this.tripService.getTrips().subscribe((trips) => {
            this.trips = trips.filter((trip) => this.favouriteList?.tripLinks?.includes(trip.id));
          });
        }
      });
    }
  }

  editFavouriteList() {
    if (this.favouriteList) {
      this.router.navigate(['favourite-list', this.favouriteList.id, 'edit']);
    }
  }

  deleteFavouriteList() {
    if (this.favouriteList) {
      this.favouriteListService.deleteList(this.favouriteList.id).then(() => {
        this.router.navigate(['explorer/favourite-lists']);
      });
    }
  }
}
