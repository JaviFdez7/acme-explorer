import { Component, Input, OnInit } from '@angular/core';
import { CubeService } from '../../../services/cube.service';
import { ActorService } from '../../../services/actor.service';
import { Trip } from '../../../models/trip.model';
import { Actor } from '../../../models/actor.model';

@Component({
  selector: 'app-cube-explorer-display',
  templateUrl: './cube-explorer-display.component.html',
  styleUrls: ['./cube-explorer-display.component.css']
})
export class CubeExplorerDisplayComponent implements OnInit {
  @Input() explorerId!: string;
  @Input() trips: Trip[] = [];

  explorer: Actor | null = null;
  spending: number = 0;

  constructor(private cubeService: CubeService, private actorService: ActorService) {}

  ngOnInit() {
    this.actorService.getActor(this.explorerId).subscribe(actor => {
      this.explorer = actor ?? null;
    });

    this.spending = this.moneySpent();
  }

  moneySpent() {
    for (const trip of this.trips) {
      this.spending += trip.price;
    }
    return this.spending;
  }

}
