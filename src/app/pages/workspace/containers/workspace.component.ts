import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceDockComponent } from '../dock/dock.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, WorkspaceDockComponent],
  template: `
    <div class="workspace-content">
      <app-workspace-dock></app-workspace-dock>
    </div>
  `
})
export class WorkspaceComponent {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = typeof window !== 'undefined' && !!window.document;
  }

  goHome() {
    this.router.navigate(['/']);
  }
} 