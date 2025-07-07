import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTableComponent {
  @Input() value: any[] = [];
  @Input() columns: any[] = [];
} 