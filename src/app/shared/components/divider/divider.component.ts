import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-shared-divider',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDividerComponent {} 