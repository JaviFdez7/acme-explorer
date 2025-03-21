import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { Actor } from '../models/actor.model';

describe('AuthService Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AuthService,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signUp', () => {
    it('should sign up a new user and store actor data in Firestore', async () => {
      const random = Date.now();
      const testEmail = `testuser${random}@example.com`;
      const testPassword = 'password123';
      const testActor = { email: testEmail, password: testPassword } as Actor;

      await service.signUp(testActor);

      const loginResponse = await service.login(testEmail, testPassword);
      expect(loginResponse.user).toBeTruthy();
      expect(loginResponse.user.uid).toBeDefined();

      await service.logout();
    });
  });

  describe('login', () => {
    it('should log in an existing user', async () => {
      const random = Date.now();
      const testEmail = `testlogin${random}@example.com`;
      const testPassword = 'password123';
      const testActor = { email: testEmail, password: testPassword } as Actor;

      await service.signUp(testActor);

      const loginResponse = await service.login(testEmail, testPassword);
      expect(loginResponse.user).toBeTruthy();
      expect(loginResponse.user.email).toEqual(testEmail);

      await service.logout();
    });
  });

  describe('logout', () => {
    it('should log out the current user', async () => {
      const random = Date.now();
      const testEmail = `testlogout${random}@example.com`;
      const testPassword = 'password123';
      const testActor = { email: testEmail, password: testPassword } as Actor;

      await service.signUp(testActor);
      await service.login(testEmail, testPassword);

      await service.logout();

      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});
