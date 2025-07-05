import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'app-workspace-megamenu',
  standalone: true,
  imports: [MegaMenuModule],
  templateUrl: './megamenu.component.html',
  styleUrls: ['./megamenu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceMegamenuComponent {
  @Input() model: MegaMenuItem[] = [];
} 