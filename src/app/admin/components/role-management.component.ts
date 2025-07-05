import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <p-card header="角色管理">
      <div *ngIf="roles$ | async as roles">
        <div *ngFor="let role of roles" class="role-item">
          <ng-container *ngIf="editingRole !== role; else editTpl">
            {{ role }}
            <button pButton type="button" icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="startEdit(role)"></button>
            <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-sm" (click)="deleteRole(role)"></button>
          </ng-container>
          <ng-template #editTpl>
            <input pInputText [(ngModel)]="editedRoleName" />
            <button pButton type="button" icon="pi pi-check" class="p-button-text p-button-sm" (click)="saveEdit(role)"></button>
            <button pButton type="button" icon="pi pi-times" class="p-button-text p-button-sm" (click)="cancelEdit()"></button>
          </ng-template>
        </div>
      </div>
      <input pInputText placeholder="新角色名稱" [(ngModel)]="newRoleName" />
      <button pButton type="button" label="新增角色" icon="pi pi-plus" class="p-button-primary" (click)="addRole()"></button>
    </p-card>
  `,
  styles: [
    `.role-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; }
     input[pInputText] { width: 100%; margin-top: 1rem; }`
  ],
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