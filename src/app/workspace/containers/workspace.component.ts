import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceDockComponent } from '../dock/dock.component';
import { Router } from '@angular/router';
import { ProgressspinnerComponent } from '../../shared/progressspinner/progressspinner.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, WorkspaceDockComponent, ProgressspinnerComponent],
  template: `
    <app-progressspinner *ngIf="isLoading" [style]="{width: '48px', height: '48px', margin: '2rem auto', display: 'block'}"></app-progressspinner>
    <div *ngIf="!isLoading" class="workspace-content">
      <app-workspace-dock></app-workspace-dock>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;
  isLoading = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = typeof window !== 'undefined' && !!window.document;
    // 可根據 dock 事件調整 isLoading 狀態
    setTimeout(() => { this.isLoading = false; }, 500); // demo: 0.5s 後關閉 loading
  }

  goHome() {
    this.router.navigate(['/']);
  }
} 