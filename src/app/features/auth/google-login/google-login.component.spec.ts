import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleLoginComponent } from './google-login.component';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { of } from 'rxjs';

describe('GoogleLoginComponent', () => {
  let component: GoogleLoginComponent;
  let fixture: ComponentFixture<GoogleLoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signInWithGoogle']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['upsertUser']);
    await TestBed.configureTestingModule({
      imports: [GoogleLoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GoogleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
