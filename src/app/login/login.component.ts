import { Component, ChangeDetectionStrategy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, AuthError } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  template: `
    <div class="login-container">
      <p-card header="登入">
        <div class="login-content">
          <button pButton type="button" label="Google Popup 登入" icon="pi pi-sign-in" (click)="signInWithPopup()"></button>
          <button pButton type="button" label="Google Redirect 登入" icon="pi pi-sign-in" (click)="signInWithRedirect()"></button>
          <p *ngIf="error" class="error">{{ error.message }}</p>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
     .login-content { display: flex; flex-direction: column; gap: 1rem; }
     .error { color: red; margin-top: 1rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private auth: Auth | null = null;
  error: AuthError | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth = getAuth();
      getRedirectResult(this.auth)
        .then(result => {
          if (result?.user) {
            this.router.navigate(['/account']);
          }
        })
        .catch(err => {
          this.error = err as AuthError;
        });
    }
  }

  async signInWithPopup(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.auth) this.auth = getAuth();
    this.error = null;
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      if (result.user) {
        this.router.navigate(['/account']);
      }
    } catch (err) {
      this.error = err as AuthError;
    }
  }

  async signInWithRedirect(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.auth) this.auth = getAuth();
    this.error = null;
    try {
      await signInWithRedirect(this.auth, new GoogleAuthProvider());
    } catch (err) {
      this.error = err as AuthError;
    }
  }
} 