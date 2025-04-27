import { Component, Input } from '@angular/core';
import { FavouriteList } from '../../../models/favourite-list.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourite-list-trip-display',
  templateUrl: './favourite-list-trip-display.component.html',
  imports: [ButtonModule, CardModule, CommonModule],
  styleUrls: ['./favourite-list-trip-display.component.css']
})
export class FavouriteListTripDisplayComponent {
  @Input() tripId: string = '';

}
