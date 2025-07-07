import { Component, ChangeDetectionStrategy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { FirebaseService } from '../../../core/services/firebase.service';
import { User } from '../../../workspace/dock/models/workspace.types';
import { Observable, from, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, ButtonModule, SelectModule, TagModule, RippleModule
  ],
  template: `
    <p-card>
      <div class="p-card-header">
        <span class="p-card-title">用戶管理</span>
        <span class="p-card-subtitle">管理系統用戶帳戶</span>
      </div>
      <div class="p-card-content">
        <div *ngIf="users$ | async as users">
          <div *ngFor="let user of users" class="user-row">
            <div style="flex:1">
              <div>{{ user.email }}</div>
              <small>{{ user.displayName || '未設定' }}｜{{ user.createdAt | date:'yyyy/MM/dd HH:mm' }}</small>
            </div>
            <p-select [options]="roles" [(ngModel)]="user.role" (onChange)="changeUserRole(user, $event.value)" styleClass="role-select"></p-select>
            <p-tag value="活躍" severity="success"></p-tag>
            <button pButton icon="pi pi-pencil" class="p-button-text" (click)="editUser(user)"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="deleteUser(user)"></button>
          </div>
          <div *ngIf="users.length === 0" class="no-users">目前沒有用戶資料</div>
        </div>
      </div>
      <div class="p-card-footer">
        <button pButton icon="pi pi-refresh" label="重新整理" (click)="refreshUsers()"></button>
      </div>
    </p-card>
  `,
  styles: [
    `.user-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #eee; }
     .user-row:last-child { border-bottom: none; }
     .role-select { min-width: 100px; }
     .no-users { text-align: center; color: #888; padding: 2rem 0; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private platformId = inject(PLATFORM_ID);
  
  users$!: Observable<User[]>;
  roles: string[] = ['admin', 'manager', 'user'];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    } else {
      this.users$ = of([]);
    }
  }

  loadUsers(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.users$ = from(this.firebaseService.getDocuments<User>('users'));
    } else {
      this.users$ = of([]);
    }
  }

  editUser(user: User): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // TODO: 實作編輯用戶功能
    console.log('編輯用戶:', user);
  }

  deleteUser(user: User): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // TODO: 實作刪除用戶功能
    console.log('刪除用戶:', user);
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  changeUserRole(user: User, newRole: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.firebaseService.updateDocument('users', user.id!, { role: newRole })
      .then(() => console.log(`Updated ${user.email} role to ${newRole}`))
      .catch(err => console.error('Role update failed', err));
  }
} 