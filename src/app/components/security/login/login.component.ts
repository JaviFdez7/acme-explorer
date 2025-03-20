import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  imports: [Dialog, ButtonModule, InputTextModule, ReactiveFormsModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  visible: boolean = false;
  loginError: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.createForm();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.loginForm.reset();
    this.loginError = false;
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(() => {
            this.visible = false;
            this.loginForm.reset();
            this.loginError = false;
            this.loading = false;
        }).catch(() => {
          this.loginError = true;
          this.loading = false;
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
