import { Component, OnInit } from '@angular/core';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { AuthService } from '../../../services/auth.service';
import { FavouriteListDisplayComponent } from '../favourite-list-display/favourite-list-display.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourite-list-list',
  imports: [CommonModule, DataView, FavouriteListDisplayComponent, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './favourite-list-list.component.html',
  styleUrls: ['./favourite-list-list.component.css']
})
export class FavouriteListListComponent implements OnInit {
  protected favouriteList: any[] = [];
  protected searchQuery = '';

  constructor(private favouriteListService: FavouriteListService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.favouriteListService.favouriteLists$.subscribe((favouriteLists: any[]) => {
      this.favouriteList = favouriteLists.filter(list => !list.deleted);
    });

    await this.favouriteListService.initializeFavouriteLists();
  }

  filteredFavouriteLists() {
    const query = this.searchQuery.toLowerCase();
    return this.favouriteList.filter(list => list.name.toLowerCase().includes(query));
  }

  clearSearch() {
    this.searchQuery = '';
  }

  createFavouriteList() {
    this.router.navigate(['/favourite-list/create']);
  }
}
