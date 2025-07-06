import { Component, ChangeDetectionStrategy, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { NgxPermissionsService } from 'ngx-permissions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  template: `
    <mat-card *ngIf="user">
      <mat-card-header>
        <div class="header-left">
          <img *ngIf="user.photoURL" [src]="user.photoURL" class="avatar"/>
          <div>
            <h2>{{ profileForm.get('displayName')!.value || user.email }}</h2>
            <p>{{ user.email }}</p>
          </div>
        </div>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-card-header>
      <mat-tab-group>
        <mat-tab label="個人資料">
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <mat-form-field appearance="outline">
              <mat-label>顯示名稱</mat-label>
              <input matInput formControlName="displayName"/>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>電話</mat-label>
              <input matInput formControlName="phone"/>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">儲存</button>
          </form>
        </mat-tab>
        <mat-tab label="通知設定">
          <mat-slide-toggle formControlName="emailNotifications">電子郵件通知</mat-slide-toggle>
          <mat-slide-toggle formControlName="pushNotifications">推播通知</mat-slide-toggle>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
  styles: [
    `.header-left { display:flex; align-items:center; } .avatar { width:40px; height:40px; border-radius:50%; margin-right:8px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private permissionsService: NgxPermissionsService = inject(NgxPermissionsService);
  private platformId = inject(PLATFORM_ID);
  user: any = null;
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
    if (!isPlatformBrowser(this.platformId)) return;
    this.user = this.auth.currentUser;
    if (this.user) {
      const uid = this.user.uid;
      try {
        const snap = await getDoc(doc(this.firestore, 'users', uid));
        const data = snap.data() as any;
        this.profileForm.patchValue({
          displayName: data.displayName || '',
          phone: data.phone || '',
          emailNotifications: data.emailNotifications || false,
          pushNotifications: data.pushNotifications || false
        });
        this.permissionsService.loadPermissions([data.role || 'user']);
      } catch (e) {
        // SSR 階段或 Firestore 失敗時容錯
      }
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
    if (isPlatformBrowser(this.platformId)) {
      this.auth.signOut();
    }
  }
} 