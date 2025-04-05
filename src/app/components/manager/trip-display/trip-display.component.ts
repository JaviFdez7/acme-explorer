import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { Actor } from '../../../models/actor.model';
import { Router } from '@angular/router';
import { ActorService } from '../../../services/actor.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ImageCarouselComponent } from '../../img-carousel/img-carousel.component';

@Component({
  selector: 'app-trip-display',
  imports: [ButtonModule, CardModule, CommonModule, ImageCarouselComponent],
  templateUrl: './trip-display.component.html',
  styleUrl: './trip-display.component.css'
})
export class ManagerTripDisplayComponent implements OnInit{
  @Input() trip: Trip;
  protected manager: Actor | undefined = undefined;

  constructor(private router: Router, private actorService: ActorService) {
    this.trip = new Trip("", "", "", "", 0, new Date(), new Date(),[],[]);
  }

  ngOnInit() {
    this.actorService.getManagers().subscribe((actors: Actor[]) => {
      this.manager = actors.find(actor => actor.id === this.trip.manager);
    });
  }

  getRequirements() {
    return this.trip.requirements;
  }

  getPictures() {
    return this.trip.pictures;
  }

  getStartDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip.startDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }
  

  getEndDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.trip.endDate as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const formatter = new Intl.DateTimeFormat(lan, { day: 'numeric', month: 'long', year: 'numeric' });
    return formatter.format(date);
  }

  goDetails() {
    this.router.navigate(['manager', this.manager?.id, 'trip', this.trip.id]);
  }
}
