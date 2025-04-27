import { Component, OnInit } from '@angular/core';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { AuthService } from '../../../services/auth.service';
import { FavouriteListDisplayComponent } from '../favourite-list-display/favourite-list-display.component';

@Component({
  selector: 'app-favourite-list-list',
  imports: [CommonModule, DataView, FavouriteListDisplayComponent],
  templateUrl: './favourite-list-list.component.html',
  styleUrls: ['./favourite-list-list.component.css']
})
export class FavouriteListListComponent implements OnInit {
  protected favouriteList: any[] = [];

  constructor(private favouriteListService: FavouriteListService, private authService: AuthService) { }

  ngOnInit() {
    this.favouriteListService.favouriteLists$.subscribe((favouriteLists: any[]) => {
      this.favouriteList = favouriteLists.filter(list => !list.deleted);
    });
  }
}
