import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CubeService } from '../../../services/cube.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { Trip } from '../../../models/trip.model';
import { CubeTripDisplayComponent } from '../cube-trip-display/cube-trip-display.component';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  imports: [CardModule, FloatLabelModule, InputTextModule, ButtonModule, DropdownModule, CommonModule, ReactiveFormsModule, AccordionModule, BadgeModule, CubeTripDisplayComponent, DataView],
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit {
  spendingForm!: FormGroup;
  amountResult: number | null = null;
  tripsResult: Trip[] = [];
  searchDetails: { startDate: Date; endDate: Date } | null = null;

  constructor(private fb: FormBuilder, private cubeService: CubeService) {}

  ngOnInit(): void {
    this.spendingForm = this.fb.group({
      selectedExplorer: ['', Validators.required],
      selectedPeriod: ['', [Validators.required, Validators.pattern('^(M(0[1-9]|[1-2][0-9]|3[0-6])|Y(0[1-3]))$')]],
    });
  }

  getAmountSpent(): void {
    if (this.spendingForm.invalid) {
      return;
    }

    const { selectedExplorer, selectedPeriod } = this.spendingForm.value;

    // Calculate startDate and endDate
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (selectedPeriod.startsWith('M')) {
      const months = parseInt(selectedPeriod.slice(1), 10);
      startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() - (months - 1) + 1, 0);
    } else if (selectedPeriod.startsWith('Y')) {
      const years = parseInt(selectedPeriod.slice(1), 10);
      startDate = new Date(now.getFullYear() - (years - 1), 0, 1);
      endDate = new Date(now.getFullYear() - (years - 1), 11, 31);
    } else {
      throw new Error('Invalid period format. Use M01-M36 for months or Y01-Y03 for years.');
    }

    this.searchDetails = { startDate, endDate };

    this.cubeService.computeExplorerSpendingCube(selectedPeriod, selectedExplorer).subscribe({
      next: (result) => {
        this.amountResult = result;
      },
      error: (err) => {
        console.error('Error fetching spending data:', err);
        this.amountResult = null;
      },
    });

    this.cubeService.getTripsAppliedByUserInCubePeriod(selectedPeriod, selectedExplorer).subscribe({
      next: (trips) => {
        this.tripsResult = trips;
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
        this.tripsResult = [];
      },
    });
  }
}
