import { Component, ChangeDetectionStrategy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, AuthError } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>登入</mat-card-title>
        </mat-card-header>
        <mat-card-content class="login-content">
          <button mat-raised-button color="primary" (click)="signInWithPopup()">
            <mat-icon>login</mat-icon>
            Google Popup 登入
          </button>
          <button mat-raised-button color="accent" (click)="signInWithRedirect()">
            <mat-icon>login</mat-icon>
            Google Redirect 登入
          </button>
          <p *ngIf="error" class="error">{{ error.message }}</p>
        </mat-card-content>
      </mat-card>
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