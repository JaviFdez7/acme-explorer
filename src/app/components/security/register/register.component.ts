import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  roleList: string[];

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roleList = this.authService.getRoles();
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      name: [''],
      surname: [''],
      password: [''],
      role: [''],
      email: [''],
      phone: [''],
      address: [''],
      validated: [ 'true'],
    });
  }
    onRegister() {
      this.authService.signUp(this.registrationForm.value);
  }
}
