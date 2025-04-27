import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-favourite-list-create',
  templateUrl: './favourite-list-create.component.html',
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
  styleUrls: ['./favourite-list-create.component.css']
})
export class FavouriteListCreateComponent {
  favouriteListForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private favouriteListService: FavouriteListService,
    private router: Router,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.favouriteListForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  onCreateFavouriteList() {
    if (this.favouriteListForm.valid) {
      this.loading = true;
      this.error = null;
      const name = this.favouriteListForm.value.name;
      this.favouriteListService.createList(name).then(() => {
        this.loading = false;
        this.success = 'Favourite list created successfully!';
        this.router.navigate(['/explorer/' + this.authService.getCurrentActor()?.id + '/favourite-lists']);
      }).catch((error) => {
        this.loading = false;
        this.error = 'Failed to create favourite list. Please try again.';
        console.error('Creation failed', error);
      });
    } else {
      this.favouriteListForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
