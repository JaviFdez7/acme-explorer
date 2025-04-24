import { Component, OnInit } from '@angular/core';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { Sponsorship } from '../../../models/sponsorship.model';

@Component({
  selector: 'app-sponsorship-banner',
  templateUrl: './sponsorship-banner.component.html',
  styleUrls: ['./sponsorship-banner.component.css']
})
export class SponsorshipBannerComponent implements OnInit {
  sponsorship!: Sponsorship;

  constructor(private sponsorshipService: SponsorshipService) {}

  ngOnInit(): void {
    this.sponsorshipService.getRandomPaidSponsorship().subscribe((sponsorship) => {
      this.sponsorship = sponsorship;
    });
  }
}
