import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component'; // 路徑依實際情況調整

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [SidenavComponent] // ★ 這裡要加
})
export class WorkspaceSidenavComponent {}
