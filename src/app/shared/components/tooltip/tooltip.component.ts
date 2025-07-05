import { Component, Input, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-shared-tooltip',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTooltipComponent {
  @Input('pTooltip') content!: string | TemplateRef<any>;
  @Input() tooltipPosition?: string;
  @Input() tooltipEvent?: string;
  @Input() escape = true;
} 