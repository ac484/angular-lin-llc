import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceMenuComponent {
  /** 菜單模型 */
  @Input() model: MenuItem[] = [];
  /** 是否為浮動模式 */
  @Input() popup: boolean = false;
} 