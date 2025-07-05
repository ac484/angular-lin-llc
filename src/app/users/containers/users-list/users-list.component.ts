import { Component, ChangeDetectionStrategy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { FirebaseService, User } from '../../../core/services/firebase.service';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, SelectModule, ButtonModule, ChipModule, FormsModule],
  template: `
    <div class="users-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="header">
            <h2>用戶管理</h2>
            <p>管理系統用戶帳戶</p>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <ng-container *ngIf="users$ | async as users">
            <p-table [value]="users">
              <ng-template pTemplate="header">
                <tr>
                  <th>電郵</th><th>名稱</th><th>創建日期</th><th>角色</th><th>動作</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-user>
                <tr>
                  <td>{{ user.email }}</td>
                  <td>{{ user.displayName || '未設定' }}</td>
                  <td>{{ user.createdAt | date:'yyyy/MM/dd HH:mm' }}</td>
                  <td>
                    <p-select [options]="roles" [(ngModel)]="user.role" (onChange)="changeUserRole(user, $any($event).value)"></p-select>
                  </td>
                  <td>
                    <p-chip label="活躍" class="p-mr-2"></p-chip>
                    <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm p-mr-2" (click)="editUser(user)"></button>
                    <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="deleteUser(user)"></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
            <div *ngIf="users.length === 0" class="no-users">
              <p>目前沒有用戶資料</p>
            </div>
          </ng-container>
        </ng-template>
        <ng-template pTemplate="footer">
          <button pButton label="重新整理" icon="pi pi-refresh" class="p-button-primary" (click)="refreshUsers()"></button>
        </ng-template>
      </p-card>
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
    this.users$ = from(this.firebaseService.getDocuments<User>('users'));
  }

  editUser(user: User): void {
    // TODO: 實作編輯用戶功能
    console.log('編輯用戶:', user);
  }

  deleteUser(user: User): void {
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