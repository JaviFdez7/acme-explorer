import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { SponsorshipDisplayComponent } from '../sponsorship-display/sponsorship-display.component';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-sponsorship-list',
  imports: [CommonModule, SponsorshipDisplayComponent, DataView],
  templateUrl: './sponsorship-list.component.html',
  styleUrls: ['./sponsorship-list.component.css']
})
export class SponsorshipListComponent implements OnInit {
  protected sponsorshipList: any[] = [];

  constructor(private sponsorshipService: SponsorshipService, private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentActor();
    if (currentUser) {
      this.sponsorshipService.getSponsorshipsBySponsorId(currentUser.id).subscribe((sponsorships: any[]) => {
        const sponsorshipFilteredList = sponsorships.filter((sponsorship) => !sponsorship.deleted);
        this.sponsorshipList = sponsorshipFilteredList;
      });
    }
  }

  getSponsorshipList() {
    return this.sponsorshipList;
  }
}
