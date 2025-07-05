import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ToastModule, ToastPositionType } from 'primeng/toast';

@Component({
  selector: 'app-shared-toast',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedToastComponent {
  @Input() key?: string;
  @Input() position: ToastPositionType = 'top-right';
  @Input() baseZIndex?: number;
  @Input() autoZIndex = true;
  @Input() life = 3000;
  @Input() preventOpenDuplicates = false;
  @Input() preventDuplicates = false;
  @Output() onClose = new EventEmitter<any>();
} 