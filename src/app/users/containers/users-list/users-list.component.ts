import { Component, ChangeDetectionStrategy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FirebaseService, User } from '../../../core/services/firebase.service';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatChipsModule,
    MatSelectModule
  ],
  template: `
    <div class="users-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>用戶管理</mat-card-title>
          <mat-card-subtitle>管理系統用戶帳戶</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="users-list" *ngIf="users$ | async as users">
            <div class="user-item" *ngFor="let user of users">
              <div class="user-info">
                <div class="user-email">{{ user.email }}</div>
                <div class="user-details">
                  <span class="user-name">{{ user.displayName || '未設定' }}</span>
                  <span class="user-date">{{ user.createdAt | date:'yyyy/MM/dd HH:mm' }}</span>
                </div>
                <mat-form-field appearance="outline">
                  <mat-label>角色</mat-label>
                  <mat-select [(value)]="user.role" (selectionChange)="changeUserRole(user, $event.value)">
                    <mat-option *ngFor="let role of roles" [value]="role">{{ role }}</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <div class="user-actions">
                <mat-chip color="primary" selected>活躍</mat-chip>
                <button mat-icon-button color="primary" (click)="editUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            
            <div class="no-users" *ngIf="users.length === 0">
              <p>目前沒有用戶資料</p>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="accent" (click)="refreshUsers()">
            <mat-icon>refresh</mat-icon>
            重新整理
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 2rem;
    }
    
    .users-list {
      margin: 1rem 0;
    }
    
    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .user-item:last-child {
      border-bottom: none;
    }
    
    .user-info {
      flex: 1;
    }
    
    .user-email {
      font-weight: 500;
      color: #333;
    }
    
    .user-details {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    .user-name {
      margin-right: 1rem;
    }
    
    .user-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .no-users {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    mat-card-actions {
      display: flex;
      gap: 1rem;
      padding: 1rem;
    }
  `],
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