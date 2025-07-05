import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-shared-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedButtonComponent {
  @Input() label: string | undefined;
  @Input() icon: string | undefined;
  @Input() disabled: boolean | undefined;
  @Output() onClick = new EventEmitter<MouseEvent>();
} 