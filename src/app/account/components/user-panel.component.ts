// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Auth
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
// PrimeNG 靜態匯入
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, ButtonModule]
})
export class UserPanelComponent {
  private auth = inject(Auth);
  user$: Observable<User | null> = user(this.auth);
}
