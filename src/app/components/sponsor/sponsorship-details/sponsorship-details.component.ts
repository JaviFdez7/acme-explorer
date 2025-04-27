import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sponsorship } from '../../../models/sponsorship.model';
import { SponsorshipService } from '../../../services/sponsorship.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Image } from 'primeng/image';
import { AuthService } from '../../../services/auth.service';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';
import { SponsorshipConfigService } from '../../../services/sponsorship-config.service';


@Component({
  selector: 'app-sponsorship-details',
  templateUrl: './sponsorship-details.component.html',
  imports: [ButtonModule, CardModule, CommonModule, Image, NgxPayPalModule],
  styleUrls: ['./sponsorship-details.component.css'],
})
export class SponsorshipDetailsComponent implements OnInit {
  sponsorship: Sponsorship | undefined;
  payPalConfig?: IPayPalConfig;

  constructor(
    private sponsorshipService: SponsorshipService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sponsorshipConfigService: SponsorshipConfigService
  ) { }

  ngOnInit() {
    const sponsorshipId = this.route.snapshot.paramMap.get('id');
    if (sponsorshipId) {
      this.sponsorshipService.getSponsorshipById(sponsorshipId).subscribe((sponsorship) => {
        this.sponsorship = sponsorship;
        this.sponsorshipConfigService.getOrCreateSponsorshipConfig().subscribe((sponsorshipConfig) => {
          const price = sponsorshipConfig.price;
          this.initConfig();
          if (this.payPalConfig) {
            this.payPalConfig.createOrderOnClient = (data) => ({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: 'EUR',
                  value: price.toString(),
                  breakdown: {
                    item_total: {
                      currency_code: 'EUR',
                      value: price.toString()
                    }
                  }
                },
                items: [{
                  name: 'Sponsorship',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: price.toString(),
                  }
                }]
              }]
            } as ICreateOrderRequest)
          }
        });
      });
    }
  }

  initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'ASD_DhyqRnbAHiqtC_V9C-qGxvlEREIQcOTtg7EhMKa984PI2bRJarwIpKRldpNEuZnagTpriBg3ZbeG',
      advanced: {
        commit: 'true'
      },
      style: {
        layout: 'vertical',
        label: 'paypal',

      },
      onApprove: (data, actions) => {
        actions.order.capture().then((details: any) => {
          console.log('Transaction approved by ' + details.payer.name.given_name);
          console.log('Transaction details: ', details);
          console.log('Transaction data: ', data);
          console.log('Transaction actions: ', actions);
        });
      },
      onClientAuthorization: async (data: any) => {
        console.log('Transaction completed by ' + data.payer.name.given_name);
        if (this.sponsorship) {
          const updatedSponsorship = new Sponsorship(this.sponsorship.bannerUrl, this.sponsorship.infoPageUrl, this.sponsorship.sponsor, true, this.sponsorship.version + 1, false);

          await this.sponsorshipService.updateSponsorship(this.sponsorship.id, updatedSponsorship).then(() => {
            this.router.navigate(['/sponsor', this.authService.getCurrentId() || "", "sponsorships"]);
          }).catch((error) => {
            console.error('Error updating sponsorship:', error);
          }
          )
        } else {
          console.error('Sponsorship or trip is undefined');
        }
      },
      onCancel: (data, actions) => {
        console.log('Transaction cancelled');
        console.log('Transaction data: ', data);
        console.log('Transaction actions: ', actions);
      },
      onError: (err) => {
        console.log('Error on transaction', err);
      },
    };
  }

  editSponsorship() {
    if (this.sponsorship) {
      this.router.navigate(['sponsorship', this.sponsorship.id, 'edit',]);
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
