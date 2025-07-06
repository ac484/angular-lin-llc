import { Component, ChangeDetectionStrategy, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FirebaseService } from '../../core/services/firebase.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ToggleButtonModule, ButtonModule],
  template: `
    <p-card>
      <div class="p-card-header">
        <span class="p-card-title">權限矩陣管理</span>
      </div>
      <div class="p-card-content">
        <p-table [value]="permissions">
          <ng-template pTemplate="header">
            <tr>
              <th>權限</th>
              <th *ngFor="let role of roles">{{ role }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-perm>
            <tr>
              <td>{{ perm }}</td>
              <td *ngFor="let role of roles">
                <p-toggleButton
                  [onLabel]="'有'"
                  [offLabel]="'無'"
                  [(ngModel)]="matrix[role + '_' + perm]"
                  (onChange)="togglePermission(role, perm, matrix[role + '_' + perm])">
                </p-toggleButton>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>
  `,
  styles: [
    `:host ::ng-deep .p-togglebutton { min-width: 48px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionMatrixComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  roles: string[] = ['admin', 'manager', 'user'];
  permissions: string[] = ['read', 'write', 'delete'];
  displayedColumns: string[] = ['permission', ...this.roles];
  matrix: Record<string, boolean> = {}; // UI toggle 狀態
  rolePermissions: Record<string, string[]> = {}; // Firestore 權限陣列

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.roles.forEach(role => {
      this.rolePermissions[role] = [];
      if (isPlatformBrowser(this.platformId)) {
        // TODO: 可從 Firestore 讀取預設權限
      }
      this.permissions.forEach(perm => {
        this.matrix[role + '_' + perm] = false;
      });
    });
  }

  togglePermission(role: string, perm: string, checked: boolean | undefined): void {
    if (checked) {
      if (!this.rolePermissions[role].includes(perm)) this.rolePermissions[role].push(perm);
    } else {
      this.rolePermissions[role] = this.rolePermissions[role].filter(p => p !== perm);
    }
    if (isPlatformBrowser(this.platformId)) {
      this.firebaseService.updateDocument('roles', role, { permissions: this.rolePermissions[role] })
        .then(() => console.log(`Permissions for ${role} updated`))
        .catch(err => console.error('更新權限失敗', err));
    }
  }
} 