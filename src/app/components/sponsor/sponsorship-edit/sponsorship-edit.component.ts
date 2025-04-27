import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sponsorship } from '../../../models/sponsorship.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sponsorship-edit',
  templateUrl: './sponsorship-edit.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule
  ],
  styleUrls: ['./sponsorship-edit.component.css']
})
export class SponsorshipEditComponent implements OnInit {
  sponsorshipForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  sponsorshipId!: string;
  sponsorship!: Sponsorship;

  constructor(
    private fb: FormBuilder,
    private sponsorshipService: SponsorshipService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sponsorshipForm = this.fb.group({
      bannerUrl: ['', [Validators.required]],
      infoPageUrl: ['', [Validators.required]],
    });

    this.sponsorshipId = this.route.snapshot.paramMap.get('id') || '';
    if (this.sponsorshipId) {
      this.sponsorshipService.getSponsorshipById(this.sponsorshipId).subscribe((sponsorship) => {
        if (sponsorship) {
          this.sponsorship = sponsorship;
          this.createForm(sponsorship);
        }
      });
    }
  }

  createForm(sponsorship: Sponsorship) {
    this.sponsorshipForm = this.fb.group({
      bannerUrl: [sponsorship.bannerUrl, [Validators.required]],
      infoPageUrl: [sponsorship.infoPageUrl, [Validators.required]],
    });
  }

  onUpdateSponsorship() {
    if (this.sponsorshipForm.valid) {
      this.loading = true;
      this.error = null;
      const updatedSponsorship = new Sponsorship(
        this.sponsorshipForm.value.bannerUrl,
        this.sponsorshipForm.value.infoPageUrl,
        this.sponsorship.sponsor,
        this.sponsorship.paid,
        this.sponsorship.version + 1,
        this.sponsorship.deleted
      );
      this.sponsorshipService.updateSponsorship(this.sponsorshipId, updatedSponsorship).then(() => {
        this.loading = false;
        this.success = 'Sponsorship updated successfully!';
        this.router.navigate(['sponsor/' + this.authService.getCurrentId() + '/sponsorships']);
      }).catch((error) => {
        this.loading = false;
        this.error = 'Failed to update sponsorship. Please try again.';
        console.error('Update failed', error);
      });
    } else {
      this.sponsorshipForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
