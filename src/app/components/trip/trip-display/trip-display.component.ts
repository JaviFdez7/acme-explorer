import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../models/trip.model';
import { ImageCarouselComponent } from "../../img-carousel/img-carousel.component";
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';
@Component({
  selector: 'app-trip-display',
  imports: [ImageCarouselComponent, CommonModule, CardModule, Button],
  templateUrl: './trip-display.component.html',
  styleUrl: './trip-display.component.css'
})
export class TripDisplayComponent implements OnInit{
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
    this.router.navigate(['/trip', this.trip.id]);
  }
}
