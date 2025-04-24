import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sponsorship } from '../../../models/sponsorship.model';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Image } from 'primeng/image';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sponsorship-details',
  templateUrl: './sponsorship-details.component.html',
  imports: [ButtonModule, CardModule, CommonModule, Image],
  styleUrls: ['./sponsorship-details.component.css'],
})
export class SponsorshipDetailsComponent implements OnInit {
  sponsorship: Sponsorship | undefined;

  constructor(
    private sponsorshipService: SponsorshipService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const sponsorshipId = this.route.snapshot.paramMap.get('id');
    if (sponsorshipId) {
      this.sponsorshipService.getSponsorshipById(sponsorshipId).subscribe((sponsorship) => {
        this.sponsorship = sponsorship;
      });
    }
  }

  editSponsorship() {
    if (this.sponsorship) {
      this.router.navigate(['sponsorship',this.sponsorship.id,'edit',]);
    }
  }

  deleteSponsorship() {
    if (this.sponsorship) {
      const deletedSponsorship = new Sponsorship(
        this.sponsorship.bannerUrl,
        this.sponsorship.infoPageUrl,
        this.sponsorship.sponsor,
        this.sponsorship.paid,
        this.sponsorship.version + 1,
        true
      );
      this.sponsorshipService.updateSponsorship(this.sponsorship.id, deletedSponsorship).then(() => {
        this.router.navigate(['sponsor/' + this.authService.getCurrentId() + '/sponsorships',]);
      });
    }
  }

  goToInfoPage() {
    if (this.sponsorship?.infoPageUrl) {
      window.open(this.sponsorship.infoPageUrl, '_blank');
    }
  }
}
