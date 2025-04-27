import { Component, Input } from '@angular/core';
import { FavouriteList } from '../../../models/favourite-list.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourite-list-display',
  templateUrl: './favourite-list-display.component.html',
  imports: [ButtonModule, CardModule, CommonModule],
  styleUrls: ['./favourite-list-display.component.css']
})
export class FavouriteListDisplayComponent {
  @Input() favouriteList: FavouriteList;

  constructor(private router: Router) {
    this.favouriteList = new FavouriteList('', '', []);
  }

  goDetails() {
    this.router.navigate(['favourite-list', this.favouriteList.id]);
  }
}
