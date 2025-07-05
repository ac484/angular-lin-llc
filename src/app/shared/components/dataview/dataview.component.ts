import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-workspace-dataview',
  standalone: true,
  imports: [DataViewModule],
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceDataviewComponent {
  @Input() value: any[] = [];
  @Input() layout: 'list' | 'grid' = 'list';
} 