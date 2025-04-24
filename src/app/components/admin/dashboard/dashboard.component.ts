import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { MeterGroup } from 'primeng/metergroup';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, CardModule, MeterGroup, FieldsetModule, TableModule],
})
export class DashboardComponent implements OnInit {
    protected tripsByEachManagerStats: any = {};
    protected applicationsByEachTripStats: any = {};
    protected tripsPriceStats: any = {};
    protected totalApplications: number = 0;
    protected findersStats: any = {};


    value = [
        { label: 'PENDING', color: '#FFB800', value: 0, icon: 'pi pi-clock', width: '0%' },
        { label: 'DUE', color: '#0b99e5', value: 0, icon: 'pi pi-dollar', width: '0%' },
        { label: 'ACCEPTED', color: '#29c74b', value: 0, icon: 'pi pi-check', width: '0%' },
        { label: 'REJECTED', color: '#ff4e4e', value: 0, icon: 'pi pi-times', width: '0%' },
    ];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        this.dashboardService.getTripsByEachManagerStats().subscribe((stats: any) => {
            this.tripsByEachManagerStats = stats;
        });

        this.dashboardService.getApplicationsByEachTripStats().subscribe((stats: any) => {
            this.applicationsByEachTripStats = stats;
        });

        this.dashboardService.getTripsPriceStats().subscribe((stats: any) => {
            this.tripsPriceStats = stats;
        });

        this.dashboardService.getApplicationsByEachStatus().subscribe((applications: any) => {
            for(const application of applications) {
                this.totalApplications += application.applications.length;
            }
            for (let value of this.value) {
                for(const application of applications) {
                    if (application.status === value.label) {
                        value.value = application.applications.length;
                        value.width = `${(value.value / this.totalApplications) * 100}%`;
                    }
                }
            }
        })

        this.dashboardService.getFindersStats().subscribe((stats: any) => {
            this.findersStats = stats;
        });
    }
}
