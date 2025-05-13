import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { AuthService } from '../../../services/auth.service';
import { WatchlistTripDisplayComponent } from '../watchlist-trip-display/watchlist-trip-display.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist-list',
  imports: [CommonModule, DataView, WatchlistTripDisplayComponent, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './watchlist-list.component.html',
  styleUrls: ['./watchlist-list.component.css']
})
export class WatchlistListComponent implements OnInit {
  protected watchlist: { tripIds: string[] } | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const storedWatchlist = localStorage.getItem('watchlist');
    this.watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : { tripIds: [] };
  }

  onTripRemoved(tripId: string) {
    if (this.watchlist) {
      this.watchlist.tripIds = this.watchlist.tripIds.filter(id => id !== tripId);
    }
  }
}
