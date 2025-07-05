import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-shared-message',
  standalone: true,
  imports: [MessageModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedMessageComponent {
  @Input() severity: 'success' | 'info' | 'warn' | 'error' = 'info';
  @Input() text?: string;
  @Input() closable?: boolean;
  @Output() onClose = new EventEmitter<{ originalEvent: Event }>();
} 