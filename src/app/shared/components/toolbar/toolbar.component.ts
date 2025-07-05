import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-shared-toolbar',
  standalone: true,
  imports: [ToolbarModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedToolbarComponent {
  @Input() styleClass?: string;
  @Input() ariaLabelledBy?: string;
} 