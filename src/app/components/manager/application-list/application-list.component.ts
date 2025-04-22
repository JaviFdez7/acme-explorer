import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { ApplicationDisplayManagerComponent } from '../application-display/application-display.component';
import { ActivatedRoute } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { Application } from '../../../models/application.model';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-application-list',
  imports: [CommonModule, BadgeModule, AccordionModule, ApplicationDisplayManagerComponent, DataView],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListManagerComponent implements OnInit {
  protected applicationList: any[] = [];
  protected pendingApplications: Application[] = [];

  constructor(private applicationService: ApplicationService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.applicationService.getApplicationsGroupedByStatusPerTrip(this.route.snapshot.params['id']).subscribe((applications: any[]) => {
      this.applicationList = applications;
    });
  }

  getApplicationList() {
    return this.applicationList;
  }

  getApplication(index: number) {
    return this.applicationList[index];
  }

  getApplicationCount() {
    return this.applicationList.length;
  }
}
