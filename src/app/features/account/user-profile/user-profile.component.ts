import { Component } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.signOut();
  }
}
