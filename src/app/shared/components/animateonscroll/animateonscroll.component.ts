import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-shared-animate-onscroll',
  standalone: true,
  imports: [AnimateOnScrollModule],
  templateUrl: './animateonscroll.component.html',
  styleUrls: ['./animateonscroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAnimateOnScrollComponent {
  @Input() enterClass: string | undefined;
  @Input() leaveClass: string | undefined;
  @Input() rootMargin: string | undefined;
  @Input() threshold: number | undefined;
  @Input() once: boolean | undefined;
} 