import { Component, Input, OnInit } from '@angular/core';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Actor } from '../../../models/actor.model';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { ActorService } from '../../../services/actor.service';
import { ApplicationService } from '../../../services/application.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { LocateService } from '../../../services/locate.service';
  
@Component({
  selector: 'app-application-display',
  imports: [CommonModule, CardModule, ButtonModule, BadgeModule, AccordionModule, DialogModule, ReactiveFormsModule, IftaLabelModule, TextareaModule],
  templateUrl: './application-display.component.html',
  styleUrl: './application-display.component.css'
})
export class ApplicationDisplayManagerComponent implements OnInit {
  @Input() application: Application;
  protected user: any;
  protected cancelForm!: FormGroup;
  protected isVisibleCancelDialog = false;

  constructor(private router: Router, private authService: AuthService, private actorService: ActorService, private applicationService: ApplicationService, private locateService: LocateService) {
    this.application = new Application("", "");
    this.user = new Actor();
    this.cancelForm = new FormGroup({
      reason: new FormControl('', { validators: [Validators.required, Validators.maxLength(400)] }),
    });
  }

  ngOnInit() {
    this.user = this.actorService.getActor(this.application.actor).subscribe((user: any) => {
      this.user = user;
    });
  }

  getApplicationDate(lan: string) {
    const rawDate: Date | { seconds: number } = this.application.date as Date | { seconds: number };
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate.seconds * 1000);
    const language = this.locateService.getCurrentLanguageValue();
    const formatter = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    return formatter.format(date);
  }

  async requestPayment() {
    const updatedApplication = new Application(this.application.trip, this.application.actor, this.application.messages, ApplicationStatus.DUE, this.application.date, this.application.reason, this.application.version + 1)

    await this.applicationService.editApplication(this.application.id, updatedApplication).then(() => {
      this.application.status = ApplicationStatus.DUE;
    }).catch((error) => {
      console.error('Error updating application:', error);
    })
  }

  showCancelDialog() {
    this.isVisibleCancelDialog = true;
  }

  async cancel() {
    if (this.application) {
      if (this.cancelForm.invalid) {
        this.cancelForm.markAllAsTouched();
        return;
      }
      const updatedApplication = new Application(this.application.trip, this.application.actor, this.application.messages, ApplicationStatus.REJECTED, this.application.date, this.cancelForm.value.reason, this.application.version + 1)

      await this.applicationService.editApplication(this.application.id, updatedApplication).then(() => {
        this.application.status = ApplicationStatus.REJECTED;
        this.application.reason = updatedApplication.reason;
        this.isVisibleCancelDialog = false;
      }).catch((error) => {
        console.error('Error updating application:', error);
      }
      )
    } else {
      console.error('Application or trip is undefined');
    }
  }
}
