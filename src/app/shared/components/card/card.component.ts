import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-shared-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedCardComponent {
  @Input() header: string | undefined;
  @Input() subheader: string | undefined;
  @Input() style: { [klass: string]: any } | null | undefined;
  @Input() styleClass: string | undefined;
} 