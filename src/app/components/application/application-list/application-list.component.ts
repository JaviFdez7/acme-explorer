import { Component, OnInit } from '@angular/core';
import { Application } from '../../../models/application.model';
import { ApplicationDisplayComponent } from '../application-display/application-display.component';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-application-list',
  imports: [CommonModule, ApplicationDisplayComponent, DataView],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  protected applicationList: Application[] = [];

  constructor(private applicationService: ApplicationService, private authService: AuthService) { }

  ngOnInit() {
    this.applicationService.getApplicationsByActor(this.authService.getCurrentId() || '').subscribe((applications: Application[]) => {
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
