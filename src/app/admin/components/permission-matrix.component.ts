import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [CommonModule, TableModule, ToggleSwitchModule, CardModule, FormsModule],
  template: `
    <p-card header="權限矩陣管理">
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
              <p-toggleSwitch [ngModel]="matrix[role].includes(perm)" (onChange)="togglePermission(role, perm, $event)"></p-toggleSwitch>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionMatrixComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  roles: string[] = ['admin', 'manager', 'user'];
  permissions: string[] = ['read', 'write', 'delete'];
  matrix: Record<string, string[]> = {};

  ngOnInit(): void {
    this.roles.forEach(role => {
      this.matrix[role] = [];
      // TODO: 可從 Firestore 讀取預設權限
    });
  }

  togglePermission(role: string, perm: string, event: any): void {
    if (event.checked) {
      this.matrix[role].push(perm);
    } else {
      this.matrix[role] = this.matrix[role].filter(p => p !== perm);
    }
    // 儲存至 Firestore 'roles' collection，文件ID 為 role 名稱
    this.firebaseService.updateDocument('roles', role, { permissions: this.matrix[role] })
      .then(() => console.log(`Permissions for ${role} updated`))
      .catch(err => console.error('更新權限失敗', err));
  }
} 