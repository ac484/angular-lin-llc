import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSlideToggleModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>權限矩陣管理</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="permissions">
          <ng-container matColumnDef="permission">
            <th mat-header-cell *matHeaderCellDef>權限</th>
            <td mat-cell *matCellDef="let perm">{{ perm }}</td>
          </ng-container>
          <ng-container *ngFor="let role of roles" [matColumnDef]="role">
            <th mat-header-cell *matHeaderCellDef>{{ role }}</th>
            <td mat-cell *matCellDef="let perm">
              <mat-slide-toggle [checked]="matrix[role].includes(perm)"
                (change)="togglePermission(role, perm, $event)">
              </mat-slide-toggle>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionMatrixComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  roles: string[] = ['admin', 'manager', 'user'];
  permissions: string[] = ['read', 'write', 'delete'];
  displayedColumns: string[] = ['permission', ...this.roles];
  matrix: Record<string, string[]> = {};

  ngOnInit(): void {
    this.roles.forEach(role => {
      this.matrix[role] = [];
      // TODO: 可從 Firestore 讀取預設權限
    });
  }

  togglePermission(role: string, perm: string, event: MatSlideToggleChange): void {
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