import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>管理儀表板</h1>
      <p>請從側邊選單選擇操作。</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent {} 