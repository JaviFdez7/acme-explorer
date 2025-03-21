import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, user, onAuthStateChanged } from '@angular/fire/auth';
import { Actor } from '../models/actor.model';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null>;
  
  constructor(private auth: Auth, private http: HttpClient, private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

   async signUp(actor: Actor) {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, actor.email, actor.password);
      console.log('User signed up successfully', res);
      const actorData = {
        ...actor,
        id: res.user.uid,
      }

      const actorRef = doc(this.firestore, 'actors', actorData.id);
      await setDoc(actorRef, {
        ...actorData,
        createdAt: new Date()
      });
      console.log('Actor data saved in Firestore successfully');
    } catch (error) {
      console.error('Error during sign up:', error);
    }
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

  logout() {
    return new Promise<any>((resolve, reject) => {
      signOut(this.auth)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  async getUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data()['role'] || null;
    }

    return null;
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMIN'];
  }
}
