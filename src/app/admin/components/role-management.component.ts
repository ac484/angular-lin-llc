import { Component, ChangeDetectionStrategy, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule
  ],
  template: `
    <p-card>
      <div class="p-card-header">
        <span class="p-card-title">角色管理</span>
      </div>
      <div class="p-card-content">
        <div *ngIf="roles$ | async as roles">
          <div *ngFor="let role of roles" class="role-item">
            <ng-container *ngIf="editingRole !== role; else editTpl">
              {{ role }}
              <button pButton icon="pi pi-pencil" class="p-button-text" (click)="startEdit(role)"></button>
              <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="deleteRole(role)"></button>
            </ng-container>
            <ng-template #editTpl>
              <input pInputText [(ngModel)]="editedRoleName" style="width: 120px; margin-right: 0.5rem;" />
              <button pButton icon="pi pi-check" class="p-button-text" (click)="saveEdit(role)"></button>
              <button pButton icon="pi pi-times" class="p-button-text" (click)="cancelEdit()"></button>
            </ng-template>
          </div>
        </div>
        <input pInputText placeholder="新角色名稱" [(ngModel)]="newRoleName" style="width: 100%; margin-top: 1rem;" />
      </div>
      <div class="p-card-footer">
        <button pButton icon="pi pi-plus" label="新增角色" (click)="addRole()"></button>
      </div>
    </p-card>
  `,
  styles: [
    `.role-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; }
     .p-card-footer { display: flex; justify-content: flex-end; }
     input[pInputText] { min-width: 100px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagementComponent implements OnInit {
  private firestore = inject(Firestore);
  roles$!: Observable<string[]>;
  newRoleName = '';
  editingRole: string | null = null;
  editedRoleName = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRoles();
    } else {
      this.roles$ = of([]);
    }
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