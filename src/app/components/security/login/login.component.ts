import { Component, NgZone } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [Dialog, ButtonModule, InputTextModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  visible: boolean = false;
  loginError: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private ngZone: NgZone) {
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

  async onLogin() {
    if (this.loginForm.valid) {
      try {
        this.ngZone.run(async () => {
          await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
          this.visible = false;
          this.loginForm.reset();
          this.loginError = false;
        });
      } catch (error) {
        this.ngZone.run(() => {
          this.loginError = true;
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
