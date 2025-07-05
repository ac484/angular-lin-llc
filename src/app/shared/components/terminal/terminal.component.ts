import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TerminalModule } from 'primeng/terminal';

@Component({
  selector: 'app-shared-terminal',
  standalone: true,
  imports: [TerminalModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTerminalComponent {
  @Input() welcomeMessage?: string;
  @Input() prompt?: string;
} 