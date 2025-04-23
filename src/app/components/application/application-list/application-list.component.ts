import { Component, OnInit } from '@angular/core';
import { ApplicationDisplayComponent } from '../application-display/application-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-application-list',
  imports: [CommonModule, ApplicationDisplayComponent, DataView, AccordionModule, BadgeModule],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  protected applicationList: any[] = [];

  constructor(private applicationService: ApplicationService, private authService: AuthService) { }

  ngOnInit() {
    this.applicationService.getApplicationsByActorIdGroupedByStatusPerTrip(this.authService.getCurrentId() || '').subscribe((applications: any[]) => {
      this.applicationList = applications;
    });
  }
}
