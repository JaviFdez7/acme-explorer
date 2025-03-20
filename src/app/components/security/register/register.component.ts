import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';



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
    Select
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  roleList: { label: string, value: string }[] = [];

constructor(private authService: AuthService, private fb: FormBuilder) {
  const roles = this.authService.getRoles();
  this.roleList = roles.map(role => ({ label: role, value: role }));
  this.createForm();
}

  createForm() {
    this.registrationForm = this.fb.group({
      name: [''],
      surname: [''],
      password: [''],
      role: [''], // Inicializar con null o un valor por defecto
      email: [''],
      phone: [''],
      address: [''],
      validated: ['true'],
    });
  }
  onRegister() {
    this.authService.signUp(this.registrationForm.value);
  }
}
