import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FavouriteListService } from '../../../services/favourite-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouriteList } from '../../../models/favourite-list.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favourite-list-edit',
  templateUrl: './favourite-list-edit.component.html',
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
  styleUrls: ['./favourite-list-edit.component.css']
})
export class FavouriteListEditComponent implements OnInit {
  favouriteListForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  favouriteListId!: string;
  favouriteList!: FavouriteList;

  constructor(
    private fb: FormBuilder,
    private favouriteListService: FavouriteListService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.favouriteListForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.favouriteListId = this.route.snapshot.paramMap.get('id') || '';
    if (this.favouriteListId) {
      this.favouriteListService.getListById(this.favouriteListId).then((favouriteList) => {
        if (favouriteList) {
          this.favouriteList = favouriteList;
          this.createForm(favouriteList);
        }
      });
    }
  }

  createForm(favouriteList: FavouriteList) {
    this.favouriteListForm = this.fb.group({
      name: [favouriteList.name, [Validators.required]],
    });
  }

  onUpdateFavouriteList() {
    if (this.favouriteListForm.valid) {
      this.loading = true;
      this.error = null;
      const updatedFavouriteList = new FavouriteList(
        this.favouriteList.id,
        this.favouriteListForm.value.name,
        this.favouriteList.tripLinks,
        this.favouriteList.version + 1,
        this.favouriteList.deleted
      );
      this.favouriteListService.updateList(updatedFavouriteList).then(() => {
        this.loading = false;
        this.success = 'Favourite list updated successfully!';
        this.router.navigate(['/favourite-list/' + this.favouriteListId]);
      }).catch((error) => {
        this.loading = false;
        this.error = 'Failed to update favourite list. Please try again.';
        console.error('Update failed', error);
      });
    } else {
      this.favouriteListForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
