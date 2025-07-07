import { Component } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import { UserService, User } from '@/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class GoogleLoginComponent {
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private userService: UserService) {}

  async login() {
    this.loading = true;
    this.error = null;
    try {
      const credential = await this.auth.signInWithGoogle();
      if (credential.user) {
        const user: User = {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL
        };
        await this.userService.upsertUser(user);
      }
    } catch (e: any) {
      this.error = e.message || '登入失敗';
    } finally {
      this.loading = false;
    }
  }
}
