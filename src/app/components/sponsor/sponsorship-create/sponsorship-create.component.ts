import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Sponsorship } from '../../../models/sponsorship';

@Component({
  selector: 'app-sponsorship-create',
  templateUrl: './sponsorship-create.component.html',
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
  styleUrls: ['./sponsorship-create.component.css']
})
export class SponsorshipCreateComponent {
  sponsorshipForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sponsorshipService: SponsorshipService,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.sponsorshipForm = this.fb.group({
      bannerUrl: ['', [Validators.required]],
      infoPageUrl: ['', [Validators.required]],
    });
  }

  onCreateSponsorship() {
    if (this.sponsorshipForm.valid) {
      this.loading = true;
      this.error = null;
      const newSponsorship = new Sponsorship(
        this.sponsorshipForm.value.bannerUrl,
        this.sponsorshipForm.value.infoPageUrl,
        this.authService.getCurrentId() || '',
        false
        );
      this.sponsorshipService.createSponsorship(newSponsorship).then(() => {
        this.loading = false;
        this.success = 'Sponsorship created successfully!';
        this.router.navigate(['/sponsorships']);
      }).catch((error) => {
        this.loading = false;
        this.error = 'Failed to create sponsorship. Please try again.';
        console.error('Creation failed', error);
      });
    } else {
      this.sponsorshipForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
