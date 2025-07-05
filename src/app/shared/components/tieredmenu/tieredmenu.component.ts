import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shared-tieredmenu',
  standalone: true,
  imports: [TieredMenuModule],
  templateUrl: './tieredmenu.component.html',
  styleUrls: ['./tieredmenu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTieredMenuComponent {
  @Input() model: MenuItem[] = [];
  @Input() popup: boolean = false;
} 