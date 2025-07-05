import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-shared-tabs',
  standalone: true,
  imports: [TabsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTabsComponent {} 