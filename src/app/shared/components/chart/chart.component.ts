import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-shared-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedChartComponent {
  @Input() type?: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
  @Input() data: any;
  @Input() options: any;
  @Output() onDataSelect = new EventEmitter<any>();
} 