import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-shared-blockui',
  standalone: true,
  imports: [BlockUIModule],
  templateUrl: './blockui.component.html',
  styleUrls: ['./blockui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedBlockuiComponent {
  @Input() target: any;
  @Input() blocked: boolean | undefined;
} 