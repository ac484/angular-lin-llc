import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  template: `
    <div class="workspaces-page">
      <h2>工作區總覽</h2>
      <p>這是 Workspaces 基本頁面。</p>
    </div>
  `,
  styles: [`
    .workspaces-page {
      padding: 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspacesComponent {} 