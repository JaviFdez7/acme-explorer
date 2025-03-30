import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CardModule, ButtonModule, InputTextModule, ReactiveFormsModule, CommonModule, FloatLabelModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  loginError = false;
  private returnUrl!: string;

  constructor(private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(() => {
            this.loginForm.reset();
            this.loginError = false;
            this.router.navigateByUrl(this.returnUrl);
        }).catch(() => {
          this.loginError = true;
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}
