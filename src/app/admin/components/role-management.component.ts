import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>角色管理</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="roles$ | async as roles">
          <div *ngFor="let role of roles" class="role-item">
            <ng-container *ngIf="editingRole !== role; else editTpl">
              {{ role }}
              <button mat-icon-button color="primary" (click)="startEdit(role)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteRole(role)">
                <mat-icon>delete</mat-icon>
              </button>
            </ng-container>
            <ng-template #editTpl>
              <mat-form-field appearance="outline">
                <input matInput [(ngModel)]="editedRoleName" />
              </mat-form-field>
              <button mat-icon-button color="primary" (click)="saveEdit(role)">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-icon-button (click)="cancelEdit()">
                <mat-icon>close</mat-icon>
              </button>
            </ng-template>
          </div>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>新角色名稱</mat-label>
          <input matInput [(ngModel)]="newRoleName" />
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="addRole()">新增角色</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .role-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; }
    mat-form-field { width: 100%; margin-top: 1rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagementComponent implements OnInit {
  private firestore = inject(Firestore);
  roles$!: Observable<string[]>;
  newRoleName = '';
  editingRole: string | null = null;
  editedRoleName = '';

  ngOnInit(): void {
    this.loadRoles();
  }

  startEdit(role: string): void {
    this.editingRole = role;
    this.editedRoleName = role;
  }

  cancelEdit(): void {
    this.editingRole = null;
    this.editedRoleName = '';
  }

  loadRoles(): void {
    this.roles$ = collectionData(collection(this.firestore, 'roles'), { idField: 'id' }).pipe(
      map((items: any[]) => items.map(item => item.id))
    );
  }

  async addRole(): Promise<void> {
    if (!this.newRoleName.trim()) return;
    await setDoc(doc(this.firestore, 'roles', this.newRoleName.trim()), {});
    this.newRoleName = '';
    this.loadRoles();
  }

  async saveEdit(oldRole: string): Promise<void> {
    const newRole = this.editedRoleName.trim();
    if (!newRole || newRole === oldRole) {
      this.cancelEdit();
      return;
    }
    const oldRef = doc(this.firestore, 'roles', oldRole);
    const data = await lastValueFrom(docData(oldRef));
    await setDoc(doc(this.firestore, 'roles', newRole), data);
    await deleteDoc(oldRef);
    this.cancelEdit();
    this.loadRoles();
  }

  async deleteRole(role: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'roles', role));
    this.loadRoles();
  }
} 