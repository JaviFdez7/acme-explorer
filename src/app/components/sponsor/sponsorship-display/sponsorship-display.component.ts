import { Component, Input } from '@angular/core';
import { Sponsorship } from '../../../models/sponsorship.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-sponsorship-display',
  templateUrl: './sponsorship-display.component.html',
  imports: [ButtonModule, CardModule, CommonModule, Image],
  styleUrls: ['./sponsorship-display.component.css']
})
export class SponsorshipDisplayComponent {
  @Input() sponsorship: Sponsorship;

  constructor(private router: Router) {
    this.sponsorship = new Sponsorship('', '', '', false);
  }

  goDetails() {
    this.router.navigate(['sponsorship', this.sponsorship.id]);
  }

  goToInfoPage() {
    window.open(this.sponsorship.infoPageUrl, '_blank');
  }
}
