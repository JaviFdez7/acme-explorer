import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
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
    Select,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  roleList: { label: string, value: string }[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    const roles = this.authService.getRoles();
    this.roleList = roles.map(role => ({ label: role, value: role }));
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]], // Inicializar con null o un valor por defecto
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
        // Firebase Auth automatically signs in the user after registration, this breaks the flow
        // A proper backend should handle this
        this.authService.logout();
        this.router.navigate(['/login']);
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
