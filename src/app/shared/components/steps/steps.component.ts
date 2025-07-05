import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shared-steps',
  standalone: true,
  imports: [StepsModule],
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedStepsComponent {
  @Input() model: MenuItem[] = [];
  @Input() activeIndex: number = 0;
  @Output() activeIndexChange = new EventEmitter<number>();
} 