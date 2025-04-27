import { Component, OnInit } from '@angular/core';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { AuthService } from '../../../services/auth.service';
import { FavouriteListAddDisplayComponent } from '../favourite-list-add-display/favourite-list-add-display.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favourite-list-add',
  imports: [CommonModule, DataView, FavouriteListAddDisplayComponent, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './favourite-list-add.component.html',
  styleUrls: ['./favourite-list-add.component.css']
})
export class FavouriteListAddComponent implements OnInit {
  protected favouriteList: any[] = [];
  protected searchQuery = ''; 
  protected tripId: string | '' = ''; // Added tripId property

  constructor(private favouriteListService: FavouriteListService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.tripId = this.route.snapshot.paramMap.get('id') || '';
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
