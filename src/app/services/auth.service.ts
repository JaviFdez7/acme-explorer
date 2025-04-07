import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { Actor } from '../models/actor.model';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  currentActor: Actor | null = null;
  private loginStatus = new Subject<boolean>();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Detectar el estado de autenticación al iniciar la app
    this.user$ = user(this.auth);
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.loadUserData(user.uid);
        this.loginStatus.next(true);
      } else {
        this.currentActor = null;
        this.loginStatus.next(false);
      }
    });
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

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in successfully with role:', this.currentActor?.role);
      return this.currentActor;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.currentActor = null;
      this.loginStatus.next(false);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  private async loadUserData(userId: string) {
    const actorRef = doc(this.firestore, `actors/${userId}`);
    const actorSnap = await getDoc(actorRef);

    if (actorSnap.exists()) {
      this.currentActor = actorSnap.data() as Actor;
    } else {
      console.warn('Actor not found in Firestore');
      this.currentActor = null;
    }
  }

  getCurrentActor(): Actor | null {
    return this.currentActor;
  }

  getCurrentRole(): string | null {
    return this.currentActor ? this.currentActor.role : null;
  }

  getCurrentId(): string | null {
    return this.currentActor ? this.currentActor.id : null;
  }

  getStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMIN', 'SPONSOR'];
  }

  isAdmin(): boolean {
    return this.currentActor?.role === 'ADMIN';
  }

  isManager(): boolean {
    return this.currentActor?.role === 'MANAGER';
  }

  isExplorer(): boolean {
    return this.currentActor?.role === 'EXPLORER';
  }
}
