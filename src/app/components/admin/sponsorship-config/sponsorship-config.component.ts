import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SponsorshipConfigService } from '../../../services/sponsorship-config.service';
import { SponsorshipConfig } from '../../../models/sponsorship-config.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LocateService } from '../../../services/locate.service';

@Component({
  selector: 'app-sponsorship-config',
  templateUrl: './sponsorship-config.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule
  ],
  styleUrls: ['./sponsorship-config.component.css']
})
export class SponsorshipConfigComponent implements OnInit {
  sponsorshipConfigForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  sponsorshipConfig!: SponsorshipConfig;
  currentChange: string = '$';

  constructor(
    private fb: FormBuilder,
    private sponsorshipConfigService: SponsorshipConfigService,
    private locateService: LocateService
  ) {}
    

  ngOnInit() {
    this.sponsorshipConfigService.getOrCreateSponsorshipConfig().subscribe((config) => {
      this.sponsorshipConfig = config;
      this.createForm(config);
    });

    this.locateService.getCurrentLanguage().subscribe((lang) => {
      this.currentChange = this.locateService.translate('€'); 
    });
  }

  createForm(config: SponsorshipConfig) {
    this.sponsorshipConfigForm = this.fb.group({
      price: [config.price, [Validators.required, Validators.min(0), this.maxTwoDecimalsValidator]],
    });
  }

  maxTwoDecimalsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
      return { maxTwoDecimals: true }; // Invalid if more than 2 decimals
    }
    return null; // Valid if no decimals or at most 2 decimals
  }

  onUpdateSponsorshipConfig() {
    if (this.sponsorshipConfigForm && this.sponsorshipConfigForm.valid) {
      this.loading = true;
      this.error = null;
      const updatedConfig = new SponsorshipConfig(
        this.sponsorshipConfigForm.value.price,
        this.sponsorshipConfig.version + 1,
        this.sponsorshipConfig.deleted
      );
      this.sponsorshipConfigService.updateSponsorshipConfig(this.sponsorshipConfig.id, updatedConfig).then(() => {
        this.loading = false;
        this.success = 'Sponsorship configuration updated successfully!';
      }).catch((error) => {
        this.loading = false;
        this.error = 'Failed to update sponsorship configuration. Please try again.';
        console.error('Update failed', error);
      });
    } else {
      this.sponsorshipConfigForm?.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
