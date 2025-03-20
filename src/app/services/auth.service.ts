import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
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

  async signUp(actor: Actor) {
    await createUserWithEmailAndPassword(this.auth, actor.email, actor.password)
      .then(async res => {
        console.log('User signed up successfully', res);
        const url = `${environment.backendApiUrlBase}/actors`;
        const body = JSON.stringify(actor);
        const response = await firstValueFrom(this.http.post(url, body, httpOptions));
        console.log('Actor created successfully');
        return response;
      })
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMIN'];
  }
}
