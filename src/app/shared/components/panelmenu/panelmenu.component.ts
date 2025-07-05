import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-panelmenu',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspacePanelMenuComponent {
  /** PanelMenu 的 model */
  @Input() model: MenuItem[] = [];
} 