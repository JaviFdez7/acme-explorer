import { Component, Input } from '@angular/core';
import { FavouriteList } from '../../../models/favourite-list.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FavouriteListService } from '../../../services/favourite-list.service';

@Component({
  selector: 'app-favourite-list-add-display',
  templateUrl: './favourite-list-add-display.component.html',
  imports: [ButtonModule, CardModule, CommonModule],
  styleUrls: ['./favourite-list-add-display.component.css']
})
export class FavouriteListAddDisplayComponent {
  @Input() favouriteList: FavouriteList;
  @Input() tripId!: string;

  constructor(private router: Router, private favouriteListService: FavouriteListService) {
    this.favouriteList = new FavouriteList('', '', []);
  }

  addTripToList() {
    if (this.tripId) {
      this.favouriteListService.addTripToList(this.favouriteList.id, this.tripId).then(() => {
        this.router.navigate(['trip', this.tripId]);
      });
    }
  }

  isTripAdded(): boolean {
    return this.favouriteList.tripLinks?.includes(this.tripId) || false;
  }

  goDetails() {
    this.router.navigate(['favourite-list', this.favouriteList.id]);
  }
}
