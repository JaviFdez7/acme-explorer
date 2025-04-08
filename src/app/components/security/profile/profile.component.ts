import { Component, OnInit } from '@angular/core';
import { Actor } from '../../../models/actor.model';
import { AuthService } from '../../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActorService } from '../../../services/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, InputTextModule, PasswordModule, ToggleButtonModule, ButtonModule, FormsModule, ReactiveFormsModule, CardModule, IftaLabelModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  actor!: Actor | undefined;
  actorForm!: FormGroup;

  constructor( private fb: FormBuilder, private actorService: ActorService, private route: Router, private router: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.actorService.getActor(id).subscribe((actor) => {
        this.actor = actor;
        this.editActorForm();
      });
    }
  }

  editActorForm() {
    this.actorForm = this.fb.group({
      name: [this.actor?.name, [Validators.required]],
      surname: [this.actor?.surname, [Validators.required]],
      phone: [this.actor?.phone, [Validators.pattern('^\\d*$')]],
      address: [this.actor?.address, ],
      email: [this.actor?.email, [Validators.required, Validators.email]],
      password: [this.actor?.password, [Validators.required, Validators.minLength(6)]],
      validated: [this.actor?.validated, [Validators.required]],
      role: [this.actor?.role, [Validators.required]]
    });
  }

  updateActor() {
    const id = this.router.snapshot.paramMap.get('id');
    if (this.actorForm.valid && this.actor !== undefined && id) {
      const updatedActor = new Actor(
      );
      updatedActor.name = this.actorForm.value.name;
      updatedActor.surname = this.actorForm.value.surname;
      updatedActor.phone = this.actorForm.value.phone;
      updatedActor.address = this.actorForm.value.address;
      updatedActor.email = this.actorForm.value.email;
      updatedActor.password = this.actorForm.value.password;
      updatedActor.validated = this.actorForm.value.validated;
      updatedActor.role = this.actorForm.value.role;
      updatedActor.version = this.actor?.version + 1;
      updatedActor.deleted = false;

      this.actorService.editActor(updatedActor, id).then(() => {
        console.log('Actor updated successfully!');
        this.route.navigate(['/'])
      }).catch(error => {
        console.error('Error updating actor:', error);
      });
    } else {
      this.actorForm.markAllAsTouched();
      console.log('Form is invalid!');
      console.log(this.actorForm.errors);
    }
  }

}
