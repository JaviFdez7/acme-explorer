import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Actor } from '../models/actor.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private http: HttpClient) { }

  signUp(actor: Actor) {
    createUserWithEmailAndPassword(this.auth, actor.email, actor.password)
      .then(async res => {
        console.log('User signed up successfully', res);
        return
      })
  }

  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(res => {
          console.log('User logged in successfully', res);
          resolve(res);
        }, err => {
          console.log('Error logging in user', err);
          reject(err);
        });
    });
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMIN'];
  }
}
