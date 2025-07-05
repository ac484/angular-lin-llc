import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Auth, getAuth, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TabsModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule
  ],
  template: `
    <p-card *ngIf="user">
      <div class="header-left">
        <img *ngIf="user?.photoURL" [src]="user.photoURL" class="avatar"/>
        <div>
          <h2>{{ profileForm.get('displayName')!.value || user?.email }}</h2>
          <p>{{ user?.email }}</p>
        </div>
        <button pButton type="button" icon="pi pi-sign-out" class="p-button-text" (click)="logout()"></button>
      </div>
      <p-tabs>
        <p-tabpanel header="個人資料">
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="p-field">
              <label for="displayName">顯示名稱</label>
              <input pInputText id="displayName" formControlName="displayName" />
            </div>
            <div class="p-field">
              <label for="phone">電話</label>
              <input pInputText id="phone" formControlName="phone" />
            </div>
            <button pButton type="submit" label="儲存" class="p-button-primary"></button>
          </form>
        </p-tabpanel>
        <p-tabpanel header="通知設定">
          <div class="p-field">
            <label for="emailNotifications">電子郵件通知</label>
            <p-toggleSwitch id="emailNotifications" formControlName="emailNotifications"></p-toggleSwitch>
          </div>
          <div class="p-field">
            <label for="pushNotifications">推播通知</label>
            <p-toggleSwitch id="pushNotifications" formControlName="pushNotifications"></p-toggleSwitch>
          </div>
        </p-tabpanel>
      </p-tabs>
    </p-card>
  `,
  styles: [
    `.header-left { display:flex; align-items:center; gap: 1rem; }
     .avatar { width:40px; height:40px; border-radius:50%; margin-right:8px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {
  private auth: Auth = getAuth();
  private firestore: Firestore = inject(Firestore);
  private permissionsService: NgxPermissionsService = inject(NgxPermissionsService);
  user = this.auth.currentUser!;
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      phone: [''],
      emailNotifications: [false],
      pushNotifications: [false]
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.user) {
      const uid = this.user.uid;
      const snap = await getDoc(doc(this.firestore, 'users', uid));
      const data = snap.data() as any;
      this.profileForm.patchValue({
        displayName: data.displayName || '',
        phone: data.phone || '',
        emailNotifications: data.emailNotifications || false,
        pushNotifications: data.pushNotifications || false
      });
      this.permissionsService.loadPermissions([data.role || 'user']);
    }
  }

  async saveProfile(): Promise<void> {
    if (!this.user) return;
    const uid = this.user.uid;
    const val = this.profileForm.value;
    await setDoc(doc(this.firestore, 'users', uid), {
      displayName: val.displayName,
      phone: val.phone,
      emailNotifications: val.emailNotifications,
      pushNotifications: val.pushNotifications
    }, { merge: true });
  }

  logout(): void {
    signOut(this.auth);
  }
} 