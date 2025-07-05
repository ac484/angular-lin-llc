import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card header="管理儀表板">
      <p>請從左側選單選擇操作。</p>
    </p-card>
  `,
  styles: [
    `.p-card { max-width: 1200px; margin: 0 auto; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent {} 