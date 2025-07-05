import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MeterGroupModule } from 'primeng/metergroup';

@Component({
  selector: 'app-shared-metergroup',
  standalone: true,
  imports: [MeterGroupModule],
  templateUrl: './metergroup.component.html',
  styleUrls: ['./metergroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedMetergroupComponent {
  @Input() value: any[] = [];
  @Input() min: number = 0;
  @Input() max: number = 100;
} 