import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
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
  templateUrl: './register-explorer.component.html',
  styleUrls: ['./register-explorer.component.css'],
})
export class RegisterExplorerComponent {
  registrationForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
  this.createForm();
}

  createForm() {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['EXPLORER', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^\\d*$')]],
      address: [''],
      validated: ['true'],
    });
  }
  onRegister() {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.error = null;
      this.authService.signUp(this.registrationForm.value).then(() => {
        this.loading = false;
        this.success = 'Registration successful!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      })
      .catch((error) => {
        this.loading = false;
        this.error = 'Registration failed. Please try again.';
        console.error('Registration failed', error);
      });
    } else {
      this.registrationForm.markAllAsTouched();
      this.error = 'Please fill in all required fields.';
      this.success = null;
    }
  }
}
