import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { CubeExplorerDisplayComponent } from '../cube-explorer-display/cube-explorer-display.component';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  imports: [CardModule, FloatLabelModule, InputTextModule, ButtonModule, DropdownModule, CommonModule, ReactiveFormsModule, AccordionModule, BadgeModule, CubeTripDisplayComponent, DataView, CubeExplorerDisplayComponent],
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit {
  spendingForm!: FormGroup;
  explorerQueryForm!: FormGroup;
  amountResult: number | null = null;
  tripsResult: Trip[] = [];
  explorerResults: string[] = [];
  explorersWithTrips: { explorerId: string; trips: Trip[] }[] = [];
  searchDetails: { startDate: Date; endDate: Date } | null = null;
  spendingSearchSubmitted = false;
  explorerSearchSubmitted = false;

  constructor(private fb: FormBuilder, private cubeService: CubeService) {}

  ngOnInit(): void {
    this.spendingForm = this.fb.group({
      selectedExplorer: ['', Validators.required],
      selectedPeriod: ['', [Validators.required, Validators.pattern('^(M(0[1-9]|[1-2][0-9]|3[0-6])|Y(0[1-3]))$')]],
    });

    this.explorerQueryForm = this.fb.group({
      queryPeriod: ['', [Validators.required, Validators.pattern('^(M(0[1-9]|[1-2][0-9]|3[0-6])|Y(0[1-3]))$')]],
      queryOperator: ['', Validators.required],
      queryValue: ['', [Validators.required, Validators.min(0), this.validateTwoDecimalPlaces]],
    });
  }

  validateTwoDecimalPlaces(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
      return { invalidDecimal: true };
    }
    return null;
  }

  getAmountSpent(): void {
    if (this.spendingForm.invalid) {
      this.spendingForm.markAllAsTouched(); 
      return;
    }

    this.spendingSearchSubmitted = true; 
    const { selectedExplorer, selectedPeriod } = this.spendingForm.value;

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

  resetSpendingSearch(): void {
    this.spendingForm.reset();
    this.spendingSearchSubmitted = false;
    this.amountResult = null;
    this.tripsResult = [];
    this.searchDetails = null;
  }

  getExplorersByCondition(): void {
    if (this.explorerQueryForm.invalid) {
      this.explorerQueryForm.markAllAsTouched(); // Mark all controls as touched to trigger validators
      return;
    }

    this.explorerSearchSubmitted = true; // Set flag to true when search is submitted
    const { queryPeriod, queryOperator, queryValue } = this.explorerQueryForm.value;

    this.cubeService.getExplorersWithTripsBySpendingCondition(queryPeriod, queryOperator, queryValue).subscribe({
      next: (explorers) => {
        this.explorersWithTrips = explorers;
      },
      error: (err) => {
        console.error('Error fetching explorers with trips:', err);
        this.explorersWithTrips = [];
      },
    });
  }

  resetExplorerSearch(): void {
    this.explorerQueryForm.reset();
    this.explorerSearchSubmitted = false;
    this.explorersWithTrips = [];
  }
}
